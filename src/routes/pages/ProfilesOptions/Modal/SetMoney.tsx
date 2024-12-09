import { useState, useContext } from "react";
import { ProfileContex } from "@/hooks/useProfileContex";
import {
	Modal,
	ModalContent,
	ModalHeader,
	Divider,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Input,
} from "@nextui-org/react";
import { setProfileMoney } from "@/utils/fileEdit";
import AlertSave from "@/components/AlertSave";

// icons
import {
	IconPencil,
	IconCurrencyEuro,
	IconCreditCardPay,
} from "@tabler/icons-react";

interface completedProps {
	error: boolean;
	completed: boolean;
}

const SetMoney = () => {
	const { selectedSave } = useContext(ProfileContex);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [money, setMoney] = useState<string>("70000000");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [completed, setCompleted] = useState<completedProps>({
		error: false,
		completed: false,
	});

	const onClickApply = async () => {
		if (completed.completed) {
			setCompleted({ error: false, completed: false });
		}

		if (!selectedSave) return;

		setIsLoading(true);

		const res = await setProfileMoney(selectedSave.dir, money);

		setCompleted({
			error: !res,
			completed: true,
		});
		setIsLoading(false);
	};

	const setMoneyNumbers = (value: string) => {
		const regex = /^[0-9]*$/;
		if (value === "" || regex.test(value)) {
			setMoney(value);
		}
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
				size="sm"
				backdrop="blur"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				shouldBlockScroll={false}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Add money
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>Add the amount of money you want in your profile</p>
								<Input
									className="mt-1"
									startContent={<IconCurrencyEuro />}
									isInvalid={money === ""}
									label="Money"
									placeholder="Enter the amount of money in EUR"
									value={money}
									onValueChange={(value) => setMoneyNumbers(value)}
									variant="bordered"
								/>
								<AlertSave
									message={
										completed.error
											? "An error occurred in the process"
											: "Saved successfully"
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
									Close
								</Button>
								<Button
									endContent={<IconCreditCardPay />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									Add
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default SetMoney;
