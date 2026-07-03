import { useState, useContext } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { Image } from "@heroui/image";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";
import AlertSave from "@/components/AlertSave";

// Hooks
import { ProfileContex } from "@/hooks/useProfileContex";
import { LocaleContext } from "@/hooks/useLocaleContext";

// Icons
import { IconPencil, IconArrowBigUpLine } from "@tabler/icons-react";
import Explosives from "@/static/icons/trailers/Explosives.svg";
import Gases from "@/static/icons/trailers/Gases.svg";
import FlammableLiquids from "@/static/icons/trailers/FlammableLiquids.svg";
import FlammableSolids from "@/static/icons/trailers/FlammableSolids.svg";
import ToxicInfectiousSubstances from "@/static/icons/trailers/ToxicInfectiousSubstances.svg";
import CorrosiveSubstances from "@/static/icons/trailers/CorrosiveSubstances.svg";

// Types
import { ATR_Values } from "@/types/ConstTypes";

interface CompletedProps {
	error: boolean;
	completed: boolean;
}

interface SkillModelProps {
	config: any;
	onSave: (
		dir: string,
		data: {
			adrBin: string;
			fragile: string;
			heavy: string;
			longDist: string;
			mechanical: string;
			urgent: string;
		}
	) => Promise<boolean>;
}

const SkillModel = ({ config, onSave }: SkillModelProps) => {
	const { selectedSave } = useContext(ProfileContex);
	const { translations } = useContext(LocaleContext);

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
	const [completed, setCompleted] = useState<CompletedProps>({
		error: false,
		completed: false,
	});

	const ATR_LIST: ATR_Values[] = [
		{ name: config.modal.input_skills_points.explosives, img: Explosives },
		{ name: config.modal.input_skills_points.gases, img: Gases },
		{
			name: config.modal.input_skills_points.flammable_liquids,
			img: FlammableLiquids,
		},
		{
			name: config.modal.input_skills_points.flammable_solids,
			img: FlammableSolids,
		},
		{
			name: config.modal.input_skills_points.toxic_and_infectious,
			img: ToxicInfectiousSubstances,
		},
		{
			name: config.modal.input_skills_points.corrosive,
			img: CorrosiveSubstances,
		},
	];

	const getBinATR = (): string => {
		let bin = "";
		for (const key of ATR_LIST) {
			if (selectedAdr.has(key.name as never)) {
				bin += "1";
			} else bin += "0";
		}
		return bin;
	};

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!selectedSave) return;

		setIsLoading(true);

		const adrBin = getBinATR();
		const res = await onSave(selectedSave.dir, {
			adrBin,
			...Skill,
		});

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
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
				{config.modal.btn_open}
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
								{config.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{config.modal.description}</p>
								<Select
									isInvalid={Skill.fragile.length === 0}
									selectionMode="multiple"
									items={ATR_LIST}
									selectedKeys={selectedAdr}
									onSelectionChange={(keys) =>
										setSelectedAdr(keys as Set<string>)
									}
									label={config.modal.input_skills_points.label}
									placeholder={config.modal.input_skills_points.placeholder}
									labelPlacement="inside"
									variant="bordered"
									size="md"
								>
									{(adr_value) => (
										<SelectItem key={adr_value.name} textValue={adr_value.name}>
											<div className="flex items-center gap-2">
												<div className="w-7.5">
													<Image
														src={adr_value.img}
														alt="ADR-icon"
														radius="full"
														loading="lazy"
													/>
												</div>
												<span className="text-small">{adr_value.name}</span>
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
									label={config.modal.long_distance}
									showSteps
									maxValue={6}
									minValue={0}
									className="max-w-md"
								/>
								<Slider
									size="lg"
									value={parseInt(Skill.heavy)}
									onChange={(e) => setSkill({ ...Skill, heavy: e.toString() })}
									step={1}
									color="warning"
									label={config.modal.high_value_cargo}
									showSteps
									maxValue={6}
									minValue={0}
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
									label={config.modal.fragile_cargo}
									showSteps
									maxValue={6}
									minValue={0}
									className="max-w-md"
								/>
								<Slider
									size="lg"
									value={parseInt(Skill.urgent)}
									onChange={(e) => setSkill({ ...Skill, urgent: e.toString() })}
									step={1}
									color="warning"
									label={config.modal.just_in_time_delivery}
									showSteps
									maxValue={6}
									minValue={0}
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
									label={config.modal.eco_driving}
									showSteps
									maxValue={6}
									minValue={0}
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
										setCompleted({ ...completed, completed: false })
									}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									{config.modal.btn_close}
								</Button>
								<Button
									endContent={<IconArrowBigUpLine />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{config.modal.btn_apply}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SkillModel;
