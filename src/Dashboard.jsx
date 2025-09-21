import React from "react";

export default function Dashboard(props) {
	return (
		<div className="flex flex-col bg-white">
			<div className="flex flex-col items-start self-stretch bg-[#E2F5E5] h-[1038px]">
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
				<div className="flex items-start mb-[1px] gap-[29px]">
					<div className="flex flex-col shrink-0 items-start pb-[461px] border border-solid border-black">
						<div className="flex items-start mb-6">
							<div className="flex flex-col shrink-0 items-start py-[18px] px-[43px] border border-solid border-black">
								<span className="text-black text-base" >
									{"All"}
								</span>
							</div>
							<div className="flex flex-col shrink-0 items-start py-[18px] px-[21px] border border-solid border-black">
								<span className="text-black text-base" >
									{"New (12)"}
								</span>
							</div>
							<div className="flex flex-col shrink-0 items-start py-[18px] px-[23px] border border-solid border-black">
								<span className="text-black text-base" >
									{"Ack (17)"}
								</span>
							</div>
							<div className="flex flex-col shrink-0 items-start py-[9px] px-[19px] border border-solid border-black">
								<span className="text-black text-base" >
									{"Resolved\n(12)"}
								</span>
							</div>
						</div>
						<div className="flex items-center mb-6 mx-[21px] gap-[17px] border border-solid border-black">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/1aqqv116_expires_30_days.png"} 
								className="w-[50px] h-[50px] object-fill"
							/>
							<span className="text-black text-base" >
								{"Search here"}
							</span>
						</div>
						<div className="flex items-center py-5 px-[29px] border border-solid border-black">
							<div className="bg-[#E47673] w-[29px] h-[29px] mr-5 border border-solid border-black">
							</div>
							<div className="flex flex-col shrink-0 items-start mr-[89px]">
								<span className="text-black text-lg font-bold" >
									{"High latency detected"}
								</span>
								<span className="text-black text-sm" >
									{"Service: Order Processing"}
								</span>
							</div>
							<span className="text-[#797E7A] text-sm" >
								{"2h ago"}
							</span>
						</div>
						<div className="flex items-center py-5 px-[29px] border border-solid border-black">
							<div className="bg-[#73E4B8] w-[29px] h-[29px] mr-5 border border-solid border-black">
							</div>
							<div className="flex flex-col shrink-0 items-center mr-[89px]">
								<span className="text-black text-lg font-bold" >
									{"Failed login attempts"}
								</span>
								<span className="text-black text-sm" >
									{"Service: User Authentication"}
								</span>
							</div>
							<span className="text-[#797E7A] text-sm" >
								{"2h ago"}
							</span>
						</div>
						<div className="flex items-center py-5 px-[29px] border border-solid border-black">
							<div className="bg-[#E4DA73] w-[29px] h-[29px] mr-5 border border-solid border-black">
							</div>
							<div className="flex flex-col shrink-0 items-start mr-[89px]">
								<span className="text-black text-lg font-bold" >
									{"Transaction failure"}
								</span>
								<span className="text-black text-sm" >
									{"Service: Payment Gateway"}
								</span>
							</div>
							<span className="text-[#797E7A] text-sm" >
								{"2h ago"}
							</span>
						</div>
						<div className="flex items-center py-5 px-[29px] border border-solid border-black">
							<div className="bg-[#E47673] w-[29px] h-[29px] mr-5 border border-solid border-black">
							</div>
							<div className="flex flex-col shrink-0 items-start mr-[89px]">
								<span className="text-black text-lg font-bold" >
									{"Increased ticket volume"}
								</span>
								<span className="text-black text-sm" >
									{"Service: Customer Support"}
								</span>
							</div>
							<span className="text-[#797E7A] text-sm" >
								{"2h ago"}
							</span>
						</div>
					</div>
					<div className="flex flex-col shrink-0 items-start mt-7">
						<div className="flex items-center mb-[38px] gap-7">
							<div className="flex flex-col shrink-0 items-start gap-[7px]">
								<span className="text-black text-[28px] font-bold" >
									{"High latency detected on Order Processing"}
								</span>
								<div className="flex items-center gap-[39px]">
									<span className="text-black text-xs" >
										{"Commit ID: 7a3b9c"}
									</span>
									<span className="text-black text-xs" >
										{"Trace ID: 123423442"}
									</span>
									<span className="text-black text-xs" >
										{"Timestamp 2024-01-15 14:30"}
									</span>
								</div>
							</div>
							<div className="flex shrink-0 items-start gap-[29px]">
								<div className="flex flex-col shrink-0 items-start bg-[#73E4B8] py-[15px] px-2.5 border border-solid border-black">
									<span className="text-black text-base" >
										{"Acknowledge"}
									</span>
								</div>
								<div className="flex flex-col shrink-0 items-start bg-[#E2F5E6] py-[15px] px-2.5 border border-solid border-black">
									<span className="text-black text-base" >
										{"Mark False Positive"}
									</span>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-start pt-6 pb-9 mb-[71px] gap-2 border border-solid border-black">
							<span className="text-black text-2xl ml-[27px]" >
								{"Incident Summary"}
							</span>
							<span className="text-black text-lg w-[838px] ml-[27px]" >
								{"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. oluptate velit esse cillum d\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint oluptate velit esse cillum dad minim veniam,"}
							</span>
						</div>
						<div className="flex items-start">
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
						<div className="flex flex-col items-start pt-7 pb-[151px] pl-[27px] pr-[423px] border border-solid border-black">
<span className="text-black text-base w-[470px]" >
								{`{
	"timestamp": "2024-01-15T14:30:15Z",
	"event_type": "performance_alert",
	"service": "Order Processing",
	"commit_id": "7a3b9c",
	"trace_id": "1234567890-abcdef",
	"severity": "critical",
	"details": {
		"metric": "p99_latency_ms",
		"value": 1523,
		"threshold": 500,
		"message": "P99 latency has exceeded the 500ms threshold."
	},
	"environment": "production",
	"host": "api-worker-7b"
}`}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}