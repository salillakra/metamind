import React from "react";

const Spinner = () => {
	return (
		<div className="absolute bg-[rgba(0,0,0,0.85)] z-20 grid place-items-center inset-0 h-screen w-screen">
			<div className="rounded-lg h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute" />
		</div>
	);
};

export default Spinner;
