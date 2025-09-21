import React from "react";
export default (props) => {
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
					<div className="flex flex-col items-start self-stretch mb-[71px] gap-[26px]">
						<span className="text-black text-[28px] font-bold" >
							{"Acknowledge Incident"}
						</span>
						<span className="text-black text-2xl font-bold" >
							{"Incident Context"}
						</span>
						<span className="text-black text-xl w-[315px]" >
							{"Title: Database Connection Failure\nService: User Authentication\nTimestamp: 2024-01-15 14:30 UTC\nCommit ID: 7a3b9c2"}
						</span>
						<div className="flex flex-col items-start self-stretch gap-4">
							<span className="text-black text-xl" >
								{"Title: The agent identified a potential issue with the database connection pool."}
							</span>
							<span className="text-black text-xl" >
								{"Suggest Fix: Review database connection settings and consider increasing maximum pool size."}
							</span>
						</div>
						<div className="flex flex-col items-start self-stretch gap-[15px]">
							<span className="text-black text-lg" >
								{"Enter the Actual Resolution/Leverage"}
							</span>
							<div className="flex flex-col items-start self-stretch pt-5 pb-[178px] border border-solid border-black">
								<span className="text-black text-lg ml-6" >
									{"Describe the steps taken to resolve the incident and any key takeaways.."}
								</span>
							</div>
						</div>
					</div>
					<div className="flex justify-between items-center self-stretch">
						<div className="flex shrink-0 items-center gap-[18px]">
							<span className="text-black text-base" >
								{"Mark as Resolved"}
							</span>
							<div className="bg-[#E2F5E6] w-7 h-7 border border-solid border-black">
							</div>
						</div>
						<div className="flex shrink-0 items-start gap-[29px]">
							<div className="flex flex-col shrink-0 items-start bg-[#E2F5E6] py-[15px] px-2.5 border border-solid border-black">
								<span className="text-black text-base" >
									{"Cancel"}
								</span>
							</div>
							<div className="flex flex-col shrink-0 items-start bg-[#73E4B8] py-[15px] px-2.5 border border-solid border-black">
								<span className="text-black text-base" >
									{"Save to Memory"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}