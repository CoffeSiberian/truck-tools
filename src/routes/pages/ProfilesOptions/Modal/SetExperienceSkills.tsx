import { useState, useContext } from "react";
import { ProfileContex } from "../../../../hooks/useProfileContex";
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
} from "@nextui-org/react";
import { setProfileSkill } from "../../../../utils/fileEdit";
import AlertSave from "../../../../components/AlertSave";

// icons
import { IconPencil, IconArrowBigUpLine } from "@tabler/icons-react";
import Explosives from "../../../../static/icons/trailers/Explosives.svg";
import Gases from "../../../../static/icons/trailers/Gases.svg";
import FlammableLiquids from "../../../../static/icons/trailers/FlammableLiquids.svg";
import FlammableSolids from "../../../../static/icons/trailers/FlammableSolids.svg";
import ToxicInfectiousSubstances from "../../../../static/icons/trailers/ToxicInfectiousSubstances.svg";
import CorrosiveSubstances from "../../../../static/icons/trailers/CorrosiveSubstances.svg";

// types
import { ATR_Values } from "../../../../types/ConstTypes";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetExperienceSkills = () => {
	const { selectedSave } = useContext(ProfileContex);
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
			name: "Explosives",
			img: Explosives,
		},
		{
			name: "Gases",
			img: Gases,
		},
		{
			name: "Flammable liquids",
			img: FlammableLiquids,
		},
		{
			name: "Flammable solids",
			img: FlammableSolids,
		},
		{
			name: "Toxic and infectious substances",
			img: ToxicInfectiousSubstances,
		},
		{
			name: "Corrosive substances",
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
				Open
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
								Set Experience Skills
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Enter the amount of experience you need</p>
								<Select
									isInvalid={Skill.fragile.length === 0}
									selectionMode="multiple"
									items={ATR_LIST}
									selectedKeys={selectedAdr}
									onSelectionChange={(keys) =>
										setSelectedAdr(keys as Set<string>)
									}
									label="ADR"
									placeholder="Select a ADR"
									labelPlacement="inside"
									variant="bordered"
									size="md"
								>
									{(adr_value) => (
										<SelectItem key={adr_value.name} textValue={adr_value.name}>
											<div className="flex items-center gap-2">
												<div className="flex items-center gap-2">
													<div className="w-[30px]">
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
									label="Long distance"
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
									label="High value merchandise"
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
									label="Fragile merchandise"
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
									label="Just in time delivery"
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
									label="Fuel efficiency"
									showSteps={true}
									maxValue={6}
									minValue={0}
									defaultValue={1}
									className="max-w-md"
								/>
								<div className="flex justify-center">
									<AlertSave
										message={
											completed.error
												? "An error occurred in the process"
												: "Saved successfully"
										}
										error={completed.error}
										show={completed.completed}
									/>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									endContent={<IconArrowBigUpLine />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									Add Experience
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
