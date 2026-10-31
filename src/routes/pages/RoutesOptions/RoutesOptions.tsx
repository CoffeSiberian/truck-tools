import { useContext } from "react";

// UI
import OptionCard from "@/components/OptionCard";

// Modals
import CreateRouteModal from "@/routes/pages/RoutesOptions/Modals/CreateRouteModal";
import ConvoyRouteModal from "@/routes/pages/RoutesOptions/Modals/ConvoyRouteModal";
import CancelJobModal from "@/routes/pages/RoutesOptions/Modals/CancelJobModal";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Images
// ets2
import img21 from "@/static/img/ets2/OptionsImages/21.webp";
import img14 from "@/static/img/ets2/OptionsImages/14.webp";
import img4 from "@/static/img/ets2/OptionsImages/4.webp";

// ats
import img21_ats from "@/static/img/ats/OptionsImages/21.webp";
import img14_ats from "@/static/img/ats/OptionsImages/14.webp";
import img4_ats from "@/static/img/ats/OptionsImages/4.webp";

const RoutesOptions = () => {
	const { game } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { routes } = translations.menu_options;

	const items = [
		{
			id: "1",
			title: routes.create_route.label_card,
			description: routes.create_route.description_card,
			image: game === "ets2" ? img21 : img21_ats,
			modal: <CreateRouteModal />,
			disable: false,
		},
		{
			id: "2",
			title: routes.convoy_share.label_card,
			description: routes.convoy_share.description_card,
			image: game === "ets2" ? img14 : img14_ats,
			modal: <ConvoyRouteModal />,
			disable: false,
		},
		{
			id: "3",
			title: routes.cancel_job.label_card,
			description: routes.cancel_job.description_card,
			image: game === "ets2" ? img4 : img4_ats,
			modal: <CancelJobModal />,
			disable: false,
		},
	];

	return (
		<div className="mt-8 flex w-full max-w-7xl flex-wrap items-center justify-center gap-6">
			{items.map((item) => (
				<OptionCard
					key={"route_card_" + item.id}
					id={item.id}
					title={item.title}
					description={item.description}
					image={item.image}
					footerJsx={item.modal}
				/>
			))}
		</div>
	);
};

export default RoutesOptions;
