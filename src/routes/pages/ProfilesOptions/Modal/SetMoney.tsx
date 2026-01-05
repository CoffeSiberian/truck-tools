import { useState, useContext } from "react";

// UI
import { useDisclosure } from "@heroui/use-disclosure";
import { Input } from "@heroui/input";
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

// Utils
import { setProfileMoney } from "@/utils/fileEdit";

// Icons
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
	const { translations } = useContext(LocaleContext);
	const { add_money } = translations.menu_options.profile;

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
				{add_money.modal.btn_open}
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
								{add_money.modal.title}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-1">
								<p>{add_money.modal.description}</p>
								<Input
									className="mt-1"
									startContent={<IconCurrencyEuro />}
									isInvalid={money === ""}
									label={add_money.modal.input_money.label}
									placeholder={add_money.modal.input_money.placeholder}
									value={money}
									onValueChange={(value) => setMoneyNumbers(value)}
									variant="bordered"
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
									{add_money.modal.btn_close}
								</Button>
								<Button
									endContent={<IconCreditCardPay />}
									isLoading={isLoading}
									color="success"
									onPress={onClickApply}
								>
									{add_money.modal.btn_apply}
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
