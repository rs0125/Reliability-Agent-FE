import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "./services/api.js";

export default function Dashboard(props) {
	const navigate = useNavigate();
	const [stats, setStats] = useState({ total: 0, new: 0, ack: 0, resolved: 0, closed: 0, open: 0 });
	const [incidents, setIncidents] = useState([]);
	const [selectedIncident, setSelectedIncident] = useState(null);
	const [suggestedSolutions, setSuggestedSolutions] = useState([]);
	const [userSolution, setUserSolution] = useState(null);
	const [loadingSolutions, setLoadingSolutions] = useState(false);
	const [loadingUserSolution, setLoadingUserSolution] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [activeTab, setActiveTab] = useState('new'); // Changed default to 'new'

	// Load suggested solutions for selected incident
	const loadSuggestedSolutions = async (incidentId) => {
		try {
			setLoadingSolutions(true);
			const solutions = await apiClient.getSuggestedSolutions(incidentId);
			setSuggestedSolutions(solutions || []);
		} catch (error) {
			// Don't log 404 errors as they're expected when no solutions exist
			if (!error.message.includes('404')) {
				console.error('Error loading suggested solutions:', error);
			}
			setSuggestedSolutions([]);
		} finally {
			setLoadingSolutions(false);
		}
	};

	// Load user solution for acknowledged incident
	const loadUserSolution = async (incidentId) => {
		try {
			setLoadingUserSolution(true);
			const solution = await apiClient.getSolutionById(incidentId.toString());
			setUserSolution(solution);
		} catch (error) {
			// Don't log 404 errors as they're expected when no user solution exists
			if (!error.message.includes('404')) {
				console.error('Error loading user solution:', error);
			}
			setUserSolution(null);
		} finally {
			setLoadingUserSolution(false);
		}
	};

	// Handle incident selection
	const handleIncidentSelect = (incident) => {
		setSelectedIncident(incident);
		
		// Always clear both solution types first
		setSuggestedSolutions([]);
		setUserSolution(null);
		setLoadingSolutions(false);
		setLoadingUserSolution(false);
		
		// Load solutions based on current tab only
		if (activeTab === 'new') {
			loadSuggestedSolutions(incident.id);
		} 
		else if (activeTab === 'ack') {
			loadUserSolution(incident.id);
		}
	};

	// Load dashboard data
	const loadData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Load stats and incidents in parallel
			const [statsResponse, incidentsResponse] = await Promise.all([
				apiClient.getStats(),
				apiClient.getIncidents()
			]);

			setStats(statsResponse);
			setIncidents(incidentsResponse.incidents || []); // Extract incidents array

			// Reset selected incident if it no longer exists in the updated data
			if (selectedIncident) {
				const updatedIncident = incidentsResponse.incidents?.find(inc => inc.id === selectedIncident.id);
				if (!updatedIncident) {
					setSelectedIncident(null);
					setSuggestedSolutions([]);
					setUserSolution(null);
				} else {
					setSelectedIncident(updatedIncident);
				}
			}
		} catch (error) {
			console.error('Error loading dashboard data:', error);
			setError('Failed to load incident data. Please check if the backend is running.');
		} finally {
			setLoading(false);
		}
	};

	// Background data refresh (without loading state)
	const backgroundRefresh = async () => {
		try {
			// Load stats and incidents in parallel
			const [statsResponse, incidentsResponse] = await Promise.all([
				apiClient.getStats(),
				apiClient.getIncidents()
			]);

			setStats(statsResponse);
			setIncidents(incidentsResponse.incidents || []); // Extract incidents array

			// Update selected incident if it still exists
			if (selectedIncident) {
				const updatedIncident = incidentsResponse.incidents?.find(inc => inc.id === selectedIncident.id);
				if (updatedIncident) {
					setSelectedIncident(updatedIncident);
				}
			}
		} catch (error) {
			console.error('Background refresh failed:', error);
			// Don't show error for background refresh failures
		}
	};	// Handle acknowledging an incident
	const handleAcknowledge = async (incidentId) => {
		try {
			// Navigate to acknowledge page immediately
			navigate(`/acknowledge/${incidentId}`);
		} catch (error) {
			console.error('Error navigating to acknowledge page:', error);
			setError('Failed to navigate to acknowledge page');
		}
	};

	// Handle marking an incident as false positive
	const handleMarkFalsePositive = async (incidentId) => {
		try {
			await apiClient.markFalsePositive(incidentId, 'security-analyst', 'Marked as false positive via UI');
			// Reload data to reflect changes
			loadData();
		} catch (error) {
			console.error('Error marking false positive:', error);
			setError('Failed to mark incident as false positive');
		}
	};

	// Filter incidents based on active tab
	const getFilteredIncidents = () => {
		// Ensure incidents is an array
		if (!Array.isArray(incidents)) return [];
		
		if (activeTab === 'all') return incidents;
		if (activeTab === 'new') {
			// "NEW" shows only unacknowledged incidents (status = "new")
			return incidents.filter(incident => incident.status === 'new');
		}
		if (activeTab === 'open') return incidents.filter(incident => 
			incident.status === 'new' || incident.status === 'ack'
		);
		return incidents.filter(incident => incident.status === activeTab);
	};

	// Get count for each status
	const getStatusCount = (status) => {
		// Ensure incidents is an array
		if (!Array.isArray(incidents)) return 0;
		
		if (status === 'open') {
			return incidents.filter(incident => 
				incident.status === 'new' || incident.status === 'ack'
			).length;
		}
		return incidents.filter(incident => incident.status === status).length;
	};

	// Format timestamp
	const formatTimestamp = (timestamp) => {
		if (!timestamp) return 'Unknown';
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffHours / 24);
		
		if (diffDays > 0) return `${diffDays}d ago`;
		if (diffHours > 0) return `${diffHours}h ago`;
		return 'Just now';
	};

	// Get priority color based on confidence or status
	const getPriorityColor = (incident) => {
		if (incident.status === 'resolved') return '#73E4B8'; // Green
		if (incident.confidence > 0.8) return '#E47673'; // Red for high confidence
		if (incident.confidence > 0.5) return '#E4DA73'; // Yellow for medium confidence
		return '#73E4B8'; // Green for low confidence
	};

	// Load data on component mount
	useEffect(() => {
		loadData();
		
		// Auto-refresh every 30 seconds in background (no loading state)
		const interval = setInterval(backgroundRefresh, 30000);
		return () => clearInterval(interval);
	}, []);

	// Handle solution loading when tab changes
	useEffect(() => {
		// Clear selected incident and solutions when switching tabs
		setSelectedIncident(null);
		setSuggestedSolutions([]);
		setUserSolution(null);
		setLoadingSolutions(false);
		setLoadingUserSolution(false);
	}, [activeTab]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen bg-[#E2F5E5]">
				<div className="text-black text-xl">Loading incidents...</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col bg-white min-h-screen">
			<div className="flex flex-col items-start self-stretch bg-[#E2F5E5] min-h-screen">
				<div className="flex justify-between items-center self-stretch py-[18px] px-[46px] border border-solid border-black">
					<img
						src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/96sjn46b_expires_30_days.png"} 
						className="w-[54px] h-[54px] object-fill"
					/>
					<span className="text-black text-xl" >
						{"Incidents"}
					</span>
					<span className="text-black text-xl" >
						{"Services"}
					</span>
					<span className="text-black text-xl" >
						{"Feedback"}
					</span>
					<span className="text-black text-xl" >
						{"Settings"}
					</span>
				</div>
				
				{/* Error Display */}
				{error && (
					<div className="mx-[46px] my-4 p-4 bg-red-100 border border-red-400 text-red-700">
						{error}
					</div>
				)}
				
				<div className="flex items-start mb-[1px] gap-[29px] w-full overflow-x-auto">
					<div className="flex flex-col shrink-0 items-start pb-[461px] border border-solid border-black min-w-[350px]">
						<div className="flex items-start mb-6">
							<div 
								className={`flex flex-col justify-center items-center py-[18px] px-[20px] border border-solid border-black cursor-pointer min-h-[60px] ${activeTab === 'all' ? 'bg-[#73E4B8]' : ''}`}
								onClick={() => setActiveTab('all')}
							>
								<span className="text-black text-base text-center" >
									{`All (${stats.total})`}
								</span>
							</div>
							<div 
								className={`flex flex-col justify-center items-center py-[18px] px-[20px] border border-solid border-black cursor-pointer min-h-[60px] ${activeTab === 'new' ? 'bg-[#73E4B8]' : ''}`}
								onClick={() => setActiveTab('new')}
							>
								<span className="text-black text-base text-center" >
									{`New (${stats.new})`}
								</span>
							</div>
							<div 
								className={`flex flex-col justify-center items-center py-[18px] px-[20px] border border-solid border-black cursor-pointer min-h-[60px] ${activeTab === 'ack' ? 'bg-[#73E4B8]' : ''}`}
								onClick={() => setActiveTab('ack')}
							>
								<span className="text-black text-base text-center" >
									{`Ack (${stats.ack})`}
								</span>
							</div>
							<div 
								className={`flex flex-col justify-center items-center py-[18px] px-[20px] border border-solid border-black cursor-pointer min-h-[60px] ${activeTab === 'resolved' ? 'bg-[#73E4B8]' : ''}`}
								onClick={() => setActiveTab('resolved')}
							>
								<span className="text-black text-base text-center" >
									{`Resolved (${stats.resolved})`}
								</span>
							</div>
						</div>
						<div className="flex items-center mb-6 mx-[21px] gap-[17px] border border-solid border-black">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/1aqqv116_expires_30_days.png"} 
								className="w-[50px] h-[50px] object-fill"
							/>
							<span className="text-black text-base pr-6" >
								{"Search here"}
							</span>
						</div>

						{/* Dynamic Incidents List */}
						{getFilteredIncidents().slice(0, 4).map((incident) => (
							<div 
								key={incident.id}
								className={`flex items-center py-3 px-[29px] border border-solid border-black cursor-pointer hover:bg-gray-100 ${selectedIncident?.id === incident.id ? 'bg-[#73E4B8]' : ''}`}
								onClick={() => handleIncidentSelect(incident)}
							>
								<div 
									className="w-[29px] h-[29px] mr-5 border border-solid border-black flex-shrink-0"
									style={{ backgroundColor: getPriorityColor(incident) }}
								>
								</div>
								<div className="flex flex-col shrink-0 items-start mr-[89px]">
									<span className="text-black text-lg font-bold" >
										{incident.summary_text?.substring(0, 25) + "..." || `Incident #${incident.id}`}
									</span>
									<span className="text-black text-sm" >
										{`Labels: ${incident.labels?.join(', ') || 'None'}`}
									</span>
									<span className="text-black text-xs" >
										{`Status: ${incident.status} • Confidence: ${(incident.confidence * 100).toFixed(1)}%`}
									</span>
								</div>
								<span className="text-[#797E7A] text-sm" >
									{formatTimestamp(incident.created_at)}
								</span>
							</div>
						))}
					</div>
					<div className="flex flex-col shrink-0 items-start mt-7 flex-1 min-w-0 max-w-full overflow-hidden">
						{selectedIncident ? (
							<>
								<div className="flex flex-col lg:flex-row items-start lg:items-center mb-[38px] gap-7 max-w-full">
									<div className="flex flex-col shrink-0 items-start gap-[7px] flex-1 min-w-0">
										<span className="text-black text-[28px] font-bold break-words" >
											{selectedIncident.summary_text?.substring(0, 60) + "..." || `Incident #${selectedIncident.id}`}
										</span>
										<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-[39px] flex-wrap">
											<span className="text-black text-xs" >
												{`Event ID: ${selectedIncident.event_id}`}
											</span>
											<span className="text-black text-xs" >
												{`Incident ID: ${selectedIncident.id}`}
											</span>
											<span className="text-black text-xs" >
												{`Status: ${selectedIncident.status}`}
											</span>
											<span className="text-black text-xs" >
												{`Created: ${new Date(selectedIncident.created_at).toLocaleString()}`}
											</span>
										</div>
									</div>
									<div className="flex shrink-0 items-start gap-[29px] flex-wrap">
										{selectedIncident.status === 'new' && (
											<button 
												className="flex flex-col shrink-0 items-start bg-[#73E4B8] py-[15px] px-2.5 border border-solid border-black hover:bg-[#5BCC9F] cursor-pointer"
												onClick={() => handleAcknowledge(selectedIncident.id)}
											>
												<span className="text-black text-base" >
													{"Acknowledge"}
												</span>
											</button>
										)}
										{(selectedIncident.status === 'new' || selectedIncident.status === 'ack') && (
											<button 
												className="flex flex-col shrink-0 items-start bg-[#E2F5E6] py-[15px] px-2.5 border border-solid border-black hover:bg-[#D1F0D6] cursor-pointer"
												onClick={() => handleMarkFalsePositive(selectedIncident.id)}
											>
												<span className="text-black text-base" >
													{"Mark False Positive"}
												</span>
											</button>
										)}
									</div>
								</div>
								<div className="flex flex-col items-start pt-6 pb-9 mb-[71px] gap-2 border border-solid border-black max-w-full">
									<span className="text-black text-2xl ml-[27px]" >
										{"Incident Summary"}
									</span>
									<span className="text-black text-lg ml-[27px] mr-[27px] break-words" >
										{selectedIncident.summary_text || "No summary available"}
									</span>
									
									{/* Show labels if available */}
									{selectedIncident.labels && selectedIncident.labels.length > 0 && (
										<div className="ml-[27px] mt-4">
											<span className="text-black text-base font-bold">Labels: </span>
											{selectedIncident.labels.map((label, index) => (
												<span key={index} className="inline-block bg-[#73E4B8] text-black text-sm px-2 py-1 mr-2 border border-solid border-black">
													{label}
												</span>
											))}
										</div>
									)}
									
									{/* Show evidence if available */}
									{selectedIncident.evidence && selectedIncident.evidence.length > 0 && (
										<div className="ml-[27px] mt-4">
											<span className="text-black text-base font-bold">Evidence: </span>
											<ul className="list-disc list-inside">
												{selectedIncident.evidence.map((evidence, index) => (
													<li key={index} className="text-black text-sm">{evidence}</li>
												))}
											</ul>
										</div>
									)}
								</div>
								
								{/* AI Suggested Solutions Section for NEW incidents */}
								{activeTab === 'new' && (
									<div className="flex flex-col items-start self-stretch bg-white border border-solid border-black mb-[71px]">
										<div className="flex justify-between items-center self-stretch py-[18px] px-[27px] bg-[#E2F5E5] border-b border-solid border-black">
											<span className="text-black text-xl font-semibold">
												AI Suggested Solutions
											</span>
										</div>
										
										<div className="w-full p-[27px] max-w-full overflow-hidden">
											{loadingSolutions ? (
												<div className="text-black text-lg">Loading AI suggested solutions...</div>
											) : suggestedSolutions.ai_recommendations ? (
												<div className="w-full">
													{/* AI Summary */}
													<div className="mb-6 p-5 bg-[#F8FFFE] border border-[#E2F5E5] rounded-lg">
														<div className="text-black text-lg font-bold mb-3 text-[#2D5A3D]">
															AI Analysis Summary
														</div>
														<div className="text-black text-base mb-2">
															<span className="font-semibold">Confidence Level:</span> 
															<span className="ml-2 px-2 py-1 bg-[#E2F5E5] rounded text-sm font-medium">
																{suggestedSolutions.ai_recommendations.confidence}
															</span>
														</div>
														<div className="text-black text-base leading-relaxed break-words">
															{suggestedSolutions.ai_recommendations.summary}
														</div>
													</div>

												{/* Root Causes & Fixes */}
												{suggestedSolutions.ai_recommendations.root_causes && suggestedSolutions.ai_recommendations.root_causes.length > 0 && (
													<div className="mb-6 p-5 bg-[#FFF9E6] border border-[#E6D39A] rounded-lg">
														<div className="text-black text-lg font-bold mb-4 text-[#8B6914]">
															Root Causes & Recommended Fixes
														</div>
														{suggestedSolutions.ai_recommendations.root_causes.map((rootCause, index) => (
															<div key={index} className="mb-4 last:mb-0 p-3 bg-white border border-[#E6D39A] rounded">
																<div className="text-black text-base font-semibold mb-2 text-[#2D5A3D]">
																	{index + 1}. {rootCause.cause}
																</div>
																<div className="text-black text-sm mb-2">
																	<span className="font-semibold text-[#2D5A3D]">Recommended Fixes:</span>
																	<ul className="list-disc list-inside ml-4 mt-1 space-y-1">
																		{rootCause.fixes.map((fix, fixIndex) => (
																			<li key={fixIndex} className="leading-relaxed">{fix}</li>
																		))}
																	</ul>
																</div>
																{rootCause.rollback && (
																	<div className="text-gray-600 text-xs p-2 bg-gray-50 rounded">
																		<span className="font-semibold">Rollback Plan:</span> {rootCause.rollback}
																	</div>
																)}
															</div>
														))}
													</div>
												)}

												{/* Similar Incidents */}
												{suggestedSolutions.similar_incidents && suggestedSolutions.similar_incidents.length > 0 && (
													<div className="mb-6 p-5 bg-[#F0F8F0] border border-[#B8E6B8] rounded-lg">
														<div className="text-black text-lg font-bold mb-4 text-[#2D5A3D]">
															Similar Past Incidents & Solutions
														</div>
														{suggestedSolutions.similar_incidents.map((incident, index) => (
															<div key={index} className="mb-4 last:mb-0 p-4 bg-white border border-[#B8E6B8] rounded">
																<div className="text-black text-base font-semibold mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
																	<span>Incident #{incident.memory_id}</span>
																	<div className="flex flex-wrap items-center gap-2">
																		<span className="px-2 py-1 bg-[#E2F5E5] text-xs font-medium rounded">
																			{(incident.similarity_score * 100).toFixed(1)}% Match
																		</span>
																		{incident.labels && incident.labels.length > 0 && (
																			<div className="flex flex-wrap gap-1">
																				{incident.labels.map((label, labelIndex) => (
																					<span key={labelIndex} className="px-2 py-1 bg-gray-100 text-xs rounded">
																						{label}
																					</span>
																				))}
																			</div>
																		)}
																	</div>
																</div>
																{incident.solution && (
																	<div className="text-black text-sm">
																		<span className="font-semibold text-[#2D5A3D] block mb-2">Previous Solution:</span>
																		<div className="p-3 bg-[#F8FFFE] border border-[#E2F5E5] rounded text-sm leading-relaxed max-h-48 overflow-y-auto max-w-full overflow-x-auto">
																			<pre className="whitespace-pre-wrap font-sans break-words">{incident.solution}</pre>
																		</div>
																	</div>
																)}
															</div>
														))}
													</div>
												)}
											</div>
										) : (
											<div className="text-gray-600 text-lg text-center py-8">
												No AI suggested solutions available for this incident type.
											</div>
										)}
										</div>
									</div>
								)}
								
								{/* User Provided Solution Section for ACK incidents */}
								{activeTab === 'ack' && (
									<div className="flex flex-col items-start self-stretch bg-white border border-solid border-black mb-[71px]">
										<div className="flex justify-between items-center self-stretch py-[18px] px-[27px] bg-[#E2F5E5] border-b border-solid border-black">
											<span className="text-black text-xl font-semibold">
												User Provided Solution
											</span>
										</div>
										
										<div className="w-full p-[27px] max-w-full overflow-hidden">
											{loadingUserSolution ? (
												<div className="text-black text-lg">Loading user solution...</div>
											) : userSolution ? (
												<div className="w-full">
													{/* User Solution Display */}
													<div className="mb-6 p-5 bg-[#F8FFFE] border border-[#E2F5E5] rounded-lg">
														<div className="text-black text-lg font-bold mb-4 text-[#2D5A3D]">
															Incident Resolution Details
														</div>
														
														<div className="grid grid-cols-1 gap-4 mb-4">
															<div className="text-black text-base">
																<span className="font-semibold text-[#2D5A3D]">Incident Type:</span>
																<span className="ml-2 px-2 py-1 bg-[#E2F5E5] rounded text-sm font-medium">
																	{userSolution.incident_type}
																</span>
															</div>
															
															{userSolution.labels && userSolution.labels.length > 0 && (
																<div className="text-black text-base">
																	<span className="font-semibold text-[#2D5A3D] block mb-1">Labels:</span>
																	<div className="flex flex-wrap gap-1">
																		{userSolution.labels.map((label, index) => (
																			<span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
																				{label}
																			</span>
																		))}
																	</div>
																</div>
															)}
															
															{userSolution.service && (
																<div className="text-black text-base">
																	<span className="font-semibold text-[#2D5A3D]">Service:</span>
																	<span className="ml-2 text-sm">{userSolution.service}</span>
																</div>
															)}
														</div>
														
														<div className="text-black text-base mb-4">
															<span className="font-semibold text-[#2D5A3D] block mb-2">Resolution Summary:</span>
															<div className="p-3 bg-white border border-[#E2F5E5] rounded leading-relaxed break-words">
																{userSolution.summary}
															</div>
														</div>
														
														<div className="text-black text-base">
															<span className="font-semibold text-[#2D5A3D] block mb-2">Detailed Solution:</span>
															<div className="p-4 bg-white border border-[#E2F5E5] rounded max-w-full overflow-x-auto">
																<pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed break-words">
																	{userSolution.solution}
																</pre>
															</div>
														</div>
													</div>
												</div>
											) : (
												<div className="text-gray-600 text-lg text-center py-8">
													No user solution available for this incident.
												</div>
											)}
										</div>
									</div>
								)}
								
								<div className="flex items-start">{/* Existing tabs section */}
									<div className="flex flex-col shrink-0 items-start bg-[#73E4B8] py-[18px] px-12 border border-solid border-black">
										<span className="text-black text-base" >
											{"Raw Event"}
										</span>
									</div>
									<div className="flex flex-col shrink-0 items-start py-[18px] px-6 border border-solid border-black">
										<span className="text-black text-base" >
											{"Memory Context"}
										</span>
									</div>
									<div className="flex flex-col shrink-0 items-start py-[18px] px-5 border border-solid border-black">
										<span className="text-black text-base" >
											{"Docs & Runbooks"}
										</span>
									</div>
								</div>
								<div className="flex flex-col items-start pt-7 pb-[151px] pl-[27px] pr-[27px] border border-solid border-black max-w-full overflow-x-auto">
									<span className="text-black text-base whitespace-pre-wrap font-mono text-sm break-words max-w-full overflow-x-auto" >
										{JSON.stringify({
											"id": selectedIncident.id,
											"event_id": selectedIncident.event_id,
											"status": selectedIncident.status,
											"confidence": selectedIncident.confidence,
											"labels": selectedIncident.labels,
											"summary": selectedIncident.summary_text,
											"evidence": selectedIncident.evidence,
											"assigned_to": selectedIncident.assigned_to,
											"created_at": selectedIncident.created_at,
											"updated_at": selectedIncident.updated_at
										}, null, 2)}
									</span>
								</div>
							</>
						) : (
							<div className="flex items-center justify-center h-64">
								<span className="text-black text-xl">Select an incident to view details</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}