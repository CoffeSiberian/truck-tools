import { useContext } from "react";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { setDriversProfileSkill } from "@/utils/fileEdit";
import SkillModel from "./SkillModal";

const SetDriversExperienceSkills = () => {
	const { translations } = useContext(LocaleContext);
	const { drivers_skills_points } = translations.menu_options.profile;

	return (
		<SkillModel
			config={drivers_skills_points}
			onSave={setDriversProfileSkill}
		/>
	);
};

export default SetDriversExperienceSkills;
