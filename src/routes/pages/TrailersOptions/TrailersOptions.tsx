import OptionCard from "../../../components/OptionCard";

// images
import img2 from "../../../static/img/OptionsImages/2.webp";
import img3 from "../../../static/img/OptionsImages/3.webp";
import img4 from "../../../static/img/OptionsImages/4.webp";
import img5 from "../../../static/img/OptionsImages/5.webp";

// modals
import ModifyWeight from "./Modals/ModifyWeight";
import UnlockTrailers from "./Modals/UnlockTrailers";
import ModifyTrailerWeight from "./Modals/ModifyTrailerWeight";
import EditLicensePlate from "./Modals/EditLicensePlate";

const TrailersOptions = () => {
	const items = [
		{
			id: "1",
			title: "Change trailer license plate",
			description: "Change the license plate of the trailer",
			image: img2,
			modal: <EditLicensePlate />,
		},
		{
			id: "2",
			title: "Modify job weight",
			description: "Modify the weight of your current job",
			image: img4,
			modal: <ModifyWeight />,
		},
		{
			id: "3",
			title: "Trailer unblocking by country",
			description: "Unlock regional blocking of trailers",
			image: img3,
			modal: <UnlockTrailers />,
		},
		{
			id: "4",
			title: "Change trailer weight",
			description: "Modifies the trailer weight, applying it only once.",
			image: img5,
			modal: <ModifyTrailerWeight />,
		},
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="my-4 grid grid-cols-3 gap-4">
				{items.map((item) => {
					return (
						<OptionCard
							key={item.id}
							id={item.id}
							title={item.title}
							description={item.description}
							image={item.image}
							footerJsx={item.modal}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default TrailersOptions;
