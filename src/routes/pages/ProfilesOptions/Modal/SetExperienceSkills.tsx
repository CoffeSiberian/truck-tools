import { useState, useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Slider,
	Select,
	SelectItem,
	Image,
} from "@heroui/react";
import { setProfileSkill } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import { IconPencil, IconArrowBigUpLine } from "@tabler/icons-react";
import Explosives from "@/static/icons/trailers/Explosives.svg";
import Gases from "@/static/icons/trailers/Gases.svg";
import FlammableLiquids from "@/static/icons/trailers/FlammableLiquids.svg";
import FlammableSolids from "@/static/icons/trailers/FlammableSolids.svg";
import ToxicInfectiousSubstances from "@/static/icons/trailers/ToxicInfectiousSubstances.svg";
import CorrosiveSubstances from "@/static/icons/trailers/CorrosiveSubstances.svg";

// types
import { ATR_Values } from "@/types/ConstTypes";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetExperienceSkills = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);
	const { skills_points } = translations.menu_options.profile;

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [Skill, setSkill] = useState({
		fragile: "0",
		heavy: "0",
		longDist: "0",
		mechanical: "0",
		urgent: "0",
	});
	const [selectedAdr, setSelectedAdr] = useState<Set<string>>(new Set([]));
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const ATR_LIST: ATR_Values[] = [
		{
			name: skills_points.modal.input_skills_points.explosives,
			img: Explosives,
		},
		{
			name: skills_points.modal.input_skills_points.gases,
			img: Gases,
		},
		{
			name: skills_points.modal.input_skills_points.flammable_liquids,
			img: FlammableLiquids,
		},
		{
			name: skills_points.modal.input_skills_points.flammable_solids,
			img: FlammableSolids,
		},
		{
			name: skills_points.modal.input_skills_points.toxic_and_infectious,
			img: ToxicInfectiousSubstances,
		},
		{
			name: skills_points.modal.input_skills_points.corrosive,
			img: CorrosiveSubstances,
		},
	];

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!selectedSave) return;

		setIsLoading(true);

		const adrBin = getBinATR();
		const res = await setProfileSkill(selectedSave.dir, { adrBin, ...Skill });

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
	};

	const getBinATR = (): string => {
		let bin = "";

		for (const key of ATR_LIST) {
			if (selectedAdr.has(key.name as never)) {
				bin += "1";
			} else bin += "0";
		}

		return bin;
	};

	return (
		<>
			<Button
				endContent={<IconPencil stroke={2} />}
				onPress={onOpen}
				isDisabled={!selectedSave}
				color="primary"
				variant="shadow"
			>
				{skills_points.modal.btn_open}
			</Button>
			<Modal
				hideCloseButton
				size="md"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{skills_points.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{skills_points.modal.description}</p>
								<Select
									isInvalid={Skill.fragile.length === 0}
									selectionMode="multiple"
									items={ATR_LIST}
									selectedKeys={selectedAdr}
									onSelectionChange={(keys) =>
										setSelectedAdr(keys as Set<string>)
									}
									label={skills_points.modal.input_skills_points.label}
									placeholder={
										skills_points.modal.input_skills_points.placeholder
									}
									labelPlacement="inside"
									variant="bordered"
									size="md"
								>
									{(adr_value) => (
										<SelectItem key={adr_value.name} textValue={adr_value.name}>
											<div className="flex items-center gap-2">
												<div className="flex items-center gap-2">
													<div className="w-7.5">
														<Image
															src={adr_value.img}
															alt="ADR-icon"
															radius="full"
															loading="lazy"
														/>
													</div>
												</div>
												<div className="flex flex-col">
													<span className="text-small">{adr_value.name}</span>
												</div>
											</div>
										</SelectItem>
									)}
								</Select>
								<Slider
									size="lg"
									value={parseInt(Skill.longDist)}
									onChange={(e) =>
										setSkill({ ...Skill, longDist: e.toString() })
									}
									step={1}
									color="warning"
									label={skills_points.modal.long_distance}
									showSteps={true}
									maxValue={6}
									minValue={0}
									defaultValue={1}
									className="max-w-md"
								/>
								<Slider
									size="lg"
									value={parseInt(Skill.heavy)}
									onChange={(e) => setSkill({ ...Skill, heavy: e.toString() })}
									step={1}
									color="warning"
									label={skills_points.modal.high_value_cargo}
									showSteps={true}
									maxValue={6}
									minValue={0}
									defaultValue={1}
									className="max-w-md"
								/>
								<Slider
									size="lg"
									value={parseInt(Skill.fragile)}
									onChange={(e) =>
										setSkill({ ...Skill, fragile: e.toString() })
									}
									step={1}
									color="warning"
									label={skills_points.modal.fragile_cargo}
									showSteps={true}
									maxValue={6}
									minValue={0}
									defaultValue={1}
									className="max-w-md"
								/>
								<Slider
									size="lg"
									value={parseInt(Skill.urgent)}
									onChange={(e) => setSkill({ ...Skill, urgent: e.toString() })}
									step={1}
									color="warning"
									label={skills_points.modal.just_in_time_delivery}
									showSteps={true}
									maxValue={6}
									minValue={0}
									defaultValue={1}
									className="max-w-md"
								/>
								<Slider
									size="lg"
									value={parseInt(Skill.mechanical)}
									onChange={(e) =>
										setSkill({ ...Skill, mechanical: e.toString() })
									}
									step={1}
									color="warning"
									label={skills_points.modal.eco_driving}
									showSteps={true}
									maxValue={6}
									minValue={0}
									defaultValue={1}
									className="max-w-md"
								/>
								<AlertSave
									message={
										completed.error
											? translations.components.alert_on_save_default.error
											: translations.components.alert_on_save_default.succes
									}
									error={completed.error}
									show={completed.completed}
									setShowFalse={() =>
										setCompleted({ error: completed.error, completed: false })
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									{skills_points.modal.btn_close}
								</Button>
								<Button
									endContent={<IconArrowBigUpLine />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{skills_points.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetExperienceSkills;
