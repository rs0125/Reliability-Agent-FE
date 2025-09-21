import React from "react";

export default (props) => {
    return (
        <div className="flex flex-col bg-[#E2F5E5]">
            <div className="flex flex-col self-stretch">
                {/* Header */}
                <header className="flex justify-between items-center self-stretch py-4 px-12 border-b border-solid border-black">
                    <img
                        src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/58zb6z14_expires_30_days.png"}
                        className="w-14 h-14 object-contain"
                        alt="Logo"
                    />
                    <nav className="flex items-center gap-12">
                        <a href="#" className="text-black text-xl">Features</a>
                        <a href="#" className="text-black text-xl">Docs</a>
                        <a href="#" className="text-black text-xl">Contribute</a>
                        <button
                            className="flex shrink-0 items-start bg-[#73E4B8] p-2.5 border border-solid border-black"
                            style={{ boxShadow: "2px 2px 0px #000000" }}
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            <span className="text-black text-xl">Try It Out</span>
                        </button>
                    </nav>
                </header>

                {/* Hero Section - Background Elements Adjusted */}
                <section className="relative px-12 pt-10 pb-20 overflow-hidden min-h-[740px] flex items-center">
                    {/* Decorative Boxes Container */}
                    <div className="absolute top-0 left-0 w-full h-full -z-0">
                        <div className="relative w-full h-full left-[10%]">
                            {/* Adjusted positions for more right alignment and consistent vertical spacing */}
                            {/* Top row, more to the right */}
                            <div className="absolute top-[8%] left-[40%] w-[25%] h-[160px] bg-[#E2F5E6] border border-solid border-black"></div>
                            <div className="absolute top-[8%] left-[68%] w-[25%] h-[160px] bg-[#E2F5E6] border border-solid border-black"></div>
                            <div className="absolute top-[8%] left-[12%] w-[25%] h-[160px] bg-[#E2F5E6] border border-solid border-black"></div>


                            {/* Middle boxes, pushed further right */}
                            <div className="absolute top-[40%] left-[48%] w-[25%] h-[160px] bg-[#E2F5E6] border border-solid border-black"></div>
                            <div className="absolute top-[40%] left-[75%] flex flex-col items-end bg-[#73E4B8] p-4 gap-3 border border-solid border-black w-[20%] h-[160px]">
                                <div className="bg-[#5BCC9F] w-full h-3"></div>
                                <div className="flex items-start gap-2 w-full">
                                    <div className="bg-[#5BCC9F] flex-grow h-3"></div>
                                    <div className="bg-[#5BCC9F] w-1/3 h-3"></div>
                                </div>
                            </div>

                            {/* Bottom box, aligned further right */}
                            <div className="absolute bottom-[8%] left-[70%] w-[25%] h-[160px] bg-[#E2F5E6] border border-solid border-black"></div>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 w-full pt-48 left-[4%]">
                        <h1 className="text-black text-[62px] font-bold max-w-3xl leading-tight">
                            {"ReliabilityAgent - Your AI \nPowered on-call SRE"}
                        </h1>
                        <p className="text-black text-xl mt-4 max-w-2xl">
                            {"Reduce alert fatigue, detect anomalies faster, and resolve incidents with AI-driven insights."}
                        </p>
                        <div className="flex items-start mt-12 gap-8">
                            <button
                                className="bg-[#73E4B8] py-3 px-11 border border-solid border-black"
                                style={{ boxShadow: "4px 4px 0px #000000" }}
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                <span className="text-black text-2xl">Try it out</span>
                            </button>
                            <button
                                className="bg-[#E2F5E6] py-3 px-8 border border-solid border-black"
                                style={{ boxShadow: "4px 4px 0px #000000" }}
                            >
                                <span className="text-black text-2xl">Learn More</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Separator */}
                <div className="self-stretch bg-[#73E4B8] h-16 border-y-2 border-solid border-black"></div>

                {/* "What Do We Solve?" Section */}
                <section className="self-stretch bg-[url('https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/3gb79oml_expires_30_days.png')] bg-cover bg-center py-28 px-12 border border-solid border-black">
                    <h2 className="text-black text-[40px] text-center mb-20">
                        {"What Do We Solve?"}
                    </h2>
                    <div className="flex flex-col md:flex-row justify-center items-stretch self-stretch gap-8 mx-auto">
                        <div className="flex flex-1 flex-col items-center gap-6 bg-[#E2F5E6] p-8 border-2 border-solid border-black" style={{ boxShadow: "4px 4px 0px #000000" }}>
                            <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/i1wn4aiy_expires_30_days.png"} className="self-stretch h-60 object-contain" alt="Hourglass indicating downtime" />
                            <span className="text-black text-[34px]">{"Down Time"}</span>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-6 bg-[#E2F5E6] p-8 border-2 border-solid border-black" style={{ boxShadow: "4px 4px 0px #000000" }}>
                            <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/8lb2q5v6_expires_30_days.png"} className="self-stretch h-60 object-contain" alt="UI with many alerts" />
                            <span className="text-black text-[34px]">{"Alert Fatigue"}</span>
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-6 bg-[#E2F5E6] p-8 border-2 border-solid border-black" style={{ boxShadow: "4px 4px 0px #000000" }}>
                            <img src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/JlrVfmBSPK/bgbfw06m_expires_30_days.png"} className="self-stretch h-60 object-contain" alt="Gears representing knowledge" />
                            <span className="text-black text-[34px]">{"Knowledge Loss"}</span>
                        </div>
                    </div>
                </section>

                {/* "Capabilities" Section */}
                <section className="self-stretch py-28 px-12">
                    <div className="mx-auto">
                        <h2 className="text-black text-[55px] mb-20">
                            {"Capabilities that Accelerate Responses"}
                        </h2>
                        <div className="flex flex-wrap -mx-4">
                            {[
                                { title: "Smart Classification &\nAnomaly Detection" },
                                { title: "AI Powered Summaries &\nRoot Cause Analysis" },
                                { title: "Memory of Past Incidents\n(Vector DB)" },
                                { title: "Human-in-the-loop\n(Approval State)" },
                                { title: "Automated Routing\nto Subscriber Teams" },
                                { title: "And Much More...", special: true },
                            ].map((item, index) => (
                                <div key={index} className="w-full md:w-1/3 px-4 mb-8">
                                    <div
                                        className={`flex flex-col justify-center items-center p-10 border border-solid border-black h-40 ${item.special ? 'bg-[#73E4B8]' : 'bg-[#E2F5E6]'}`}
                                        style={{ boxShadow: "4px 4px 0px #000000" }}
                                    >
                                        <span className="text-black text-2xl text-center">{item.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};