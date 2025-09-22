import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "./src/services/api.js";

export default function Acknowledge(props) {
	const { incidentId } = useParams();
	const navigate = useNavigate();
	const [incident, setIncident] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [solutionTitle, setSolutionTitle] = useState('');
	const [solutionContent, setSolutionContent] = useState('');
	const [markAsResolved, setMarkAsResolved] = useState(false);

	// Load incident data
	const loadIncident = async () => {
		try {
			setLoading(true);
			setError(null);
			const incidentData = await apiClient.getIncident(incidentId);
			setIncident(incidentData);
		} catch (error) {
			console.error('Error loading incident:', error);
			setError('Failed to load incident data');
		} finally {
			setLoading(false);
		}
	};

	// Handle acknowledgment with optional resolution
	const handleSaveToMemory = async () => {
		try {
			setSaving(true);
			setError(null);

			// First acknowledge the incident
			await apiClient.acknowledgeIncident(
				incidentId, 
				'security-analyst', 
				'Incident acknowledged via UI'
			);

			// Save the solution if provided
			if (solutionTitle.trim() && solutionContent.trim()) {
				// Determine incident type from labels or use first label
				const incidentType = incident.labels && incident.labels.length > 0 
					? incident.labels[0] 
					: 'UNKNOWN';
					
				await apiClient.saveSolution(
					incidentId,
					solutionTitle,
					solutionContent,
					incidentType,
					'security-analyst'
				);
			}

			// If marked as resolved, also resolve it
			if (markAsResolved) {
				await apiClient.resolveIncident(
					incidentId,
					'security-analyst',
					solutionContent || 'Incident resolved during acknowledgment'
				);
			}

			// Navigate back to dashboard
			navigate('/dashboard');
		} catch (error) {
			console.error('Error processing incident:', error);
			setError('Failed to process incident');
		} finally {
			setSaving(false);
		}
	};

	const handleCancel = () => {
		navigate('/dashboard');
	};

	useEffect(() => {
		if (incidentId) {
			loadIncident();
		}
	}, [incidentId]);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen bg-[#E2F5E5]">
				<div className="text-black text-xl">Loading incident...</div>
			</div>
		);
	}

	if (error || !incident) {
		return (
			<div className="flex justify-center items-center h-screen bg-[#E2F5E5]">
				<div className="text-red-600 text-xl">{error || 'Incident not found'}</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col bg-white">
			<div className="self-stretch bg-[#E2F5E5] h-[1023px]">
				<div className="flex justify-between items-center self-stretch py-[18px] px-[46px] mb-[71px] border border-solid border-black">
					<img
						src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/1udfx6kd_expires_30_days.png"} 
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
				<div className="self-stretch mb-[88px] mx-16">
					{/* Error Display */}
					{error && (
						<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700">
							{error}
						</div>
					)}
					
					<div className="flex flex-col items-start self-stretch mb-[71px] gap-[26px]">
						<span className="text-black text-[28px] font-bold" >
							{"Acknowledge Incident #" + incident.id}
						</span>
						<span className="text-black text-2xl font-bold" >
							{"Incident Context"}
						</span>
						<div className="text-black text-xl w-full max-w-[600px]">
							<div><strong>Title:</strong> {incident.summary_text?.substring(0, 100) + "..." || `Incident #${incident.id}`}</div>
							<div><strong>Labels:</strong> {incident.labels?.join(', ') || 'None'}</div>
							<div><strong>Status:</strong> {incident.status}</div>
							<div><strong>Confidence:</strong> {(incident.confidence * 100).toFixed(1)}%</div>
							<div><strong>Created:</strong> {new Date(incident.created_at).toLocaleString()}</div>
							<div><strong>Event ID:</strong> {incident.event_id}</div>
						</div>
						<div className="flex flex-col items-start self-stretch gap-4">
							<span className="text-black text-xl" >
								{"Summary: " + (incident.summary_text || "No summary available")}
							</span>
							{incident.evidence && incident.evidence.length > 0 && (
								<div>
									<span className="text-black text-xl font-bold">Evidence:</span>
									<ul className="list-disc list-inside ml-4">
										{incident.evidence.map((evidence, index) => (
											<li key={index} className="text-black text-lg">{evidence}</li>
										))}
									</ul>
								</div>
							)}
						</div>
						<div className="flex flex-col items-start self-stretch gap-[15px]">
							<span className="text-black text-lg font-bold" >
								{"Save Solution to Memory"}
							</span>
							<div className="text-black text-sm mb-2">
								Incident Type: <span className="font-bold">{incident.labels && incident.labels.length > 0 ? incident.labels[0] : 'UNKNOWN'}</span>
							</div>
							
							<span className="text-black text-lg" >
								{"Solution Title"}
							</span>
							<input
								type="text"
								className="w-full p-3 border border-solid border-black text-black text-lg"
								placeholder="Brief title for the solution (e.g., 'Database Connection Pool Fix')"
								value={solutionTitle}
								onChange={(e) => setSolutionTitle(e.target.value)}
								disabled={saving}
							/>
							
							<span className="text-black text-lg" >
								{"Solution Details"}
							</span>
							<textarea
								className="w-full min-h-[200px] p-5 border border-solid border-black text-black text-lg resize-vertical"
								placeholder="Describe the detailed solution, steps taken to resolve the incident, and any key takeaways..."
								value={solutionContent}
								onChange={(e) => setSolutionContent(e.target.value)}
								disabled={saving}
							/>
						</div>
					</div>
					<div className="flex justify-between items-center self-stretch">
						<div className="flex shrink-0 items-center gap-[18px]">
							<span className="text-black text-base" >
								{"Mark as Resolved"}
							</span>
							<input
								type="checkbox"
								className="w-7 h-7 border border-solid border-black"
								checked={markAsResolved}
								onChange={(e) => setMarkAsResolved(e.target.checked)}
							/>
						</div>
						<div className="flex shrink-0 items-start gap-[29px]">
							<button 
								className="flex flex-col shrink-0 items-start bg-[#E2F5E6] py-[15px] px-2.5 border border-solid border-black hover:bg-[#D1F0D6] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={handleCancel}
								disabled={saving}
							>
								<span className="text-black text-base" >
									{"Cancel"}
								</span>
							</button>
							<button 
								className="flex flex-col shrink-0 items-start bg-[#73E4B8] py-[15px] px-2.5 border border-solid border-black hover:bg-[#5BCC9F] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
								onClick={handleSaveToMemory}
								disabled={saving}
							>
								<span className="text-black text-base" >
									{saving ? "Saving..." : "Save to Memory"}
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}