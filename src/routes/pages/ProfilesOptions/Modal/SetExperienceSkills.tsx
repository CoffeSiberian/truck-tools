import { useContext } from "react";
import { LocaleContext } from "@/hooks/useLocaleContext";
import { setProfileSkill } from "@/utils/fileEdit";
import SkillModel from "./SkillModal";

const SetExperienceSkills = () => {
	const { translations } = useContext(LocaleContext);
	const { skills_points } = translations.menu_options.profile;

	return <SkillModel config={skills_points} onSave={setProfileSkill} />;
};

export default SetExperienceSkills;
