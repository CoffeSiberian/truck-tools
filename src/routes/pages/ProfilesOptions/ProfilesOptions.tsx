import { Button } from "@nextui-org/react";
import OptionCard from "../../../components/OptionCard";

// icons
import { IconPencil } from "@tabler/icons-react";

// images
import testImage from "../../../static/img/testimg.webp";

const ProfilesOptions = () => {
	const items = [
		{
			id: "1",
			title: "Add infinite money",
			description: "Add infinite money to the current profile",
			image: testImage,
		},
		{
			id: "2",
			title: "Add level 100",
			description: "Add level 100 to the current profile",
			image: testImage,
		},
		{
			id: "3",
			title: "Unlock garages",
			description: "Unlock all garages",
			image: testImage,
		},
		{
			id: "4",
			title: "Unlock all cities",
			description: "Change the current truck",
			image: testImage,
		},
		{
			id: "5",
			title: "Unlock all dealerships",
			description: "Unlock all dealerships",
			image: testImage,
		},
		{
			id: "6",
			title: "Unlock skills",
			description: "Unlock all skills",
			image: testImage,
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
							footerJsx={
								<Button
									endContent={<IconPencil stroke={2} />}
									color="primary"
									variant="shadow"
								>
									Open
								</Button>
							}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default ProfilesOptions;
