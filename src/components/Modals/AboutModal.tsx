import { FC, useContext } from "react";

// Tauri
import { open } from "@tauri-apps/plugin-shell";

// Hooks
import { LocaleContext } from "@/hooks/useLocaleContext";

// UI
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@heroui/modal";

// Icons
import {
	IconBrandGithub,
	IconBrandTwitch,
	IconBriefcase,
} from "@tabler/icons-react";

interface AboutModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

const AboutModal: FC<AboutModalProps> = ({ isOpen, onOpenChange }) => {
	const { translations } = useContext(LocaleContext);
	const { about } = translations.menu_options;

	return (
		<Modal
			size="md"
			backdrop="blur"
			isOpen={isOpen}
			onOpenChange={() => onOpenChange()}
			shouldBlockScroll={false}
		>
			<ModalContent>
				{() => (
					<>
						<ModalHeader className="flex flex-col gap-1">
							Truck Tools - Preview 0.12.1
						</ModalHeader>
						<Divider />
						<ModalBody className="flex items-center justify-center py-1">
							<p>{about.description}</p>
							<div className="mt-2 flex flex-row items-center gap-2">
								<Avatar
									src="https://avatars.githubusercontent.com/u/61036343?v=4"
									size="lg"
									name="Fernando Garrido"
									alt="Fernando Garrido"
								></Avatar>
								<div>
									<div className="flex justify-center">
										<h4 className="text-large font-bold">Fernando Garrido</h4>
									</div>
									<small className="text-default-500">
										SiberianCoffe - Full Stack Developer
									</small>
								</div>
							</div>
						</ModalBody>
						<ModalFooter className="flex flex-col items-center justify-center">
							<div className="flex gap-1">
								<Button
									onPress={() => open("https://github.com/CoffeSiberian")}
									variant="light"
									aria-label="github-link"
								>
									<IconBrandGithub size={30} />
									<p className="font-bold">CoffeSiberian</p>
								</Button>
								<Button
									onPress={() => open("https://www.twitch.tv/siberiancoffe")}
									variant="light"
									aria-label="github-link"
								>
									<IconBrandTwitch size={30} />
									<p className="font-bold">siberiancoffe</p>
								</Button>
							</div>
							<div className="flex gap-1">
								<Button
									onPress={() => open("https://siberiancoffe.dev")}
									variant="light"
									aria-label="github-link"
								>
									<IconBriefcase size={30} />
									<p className="font-bold">siberiancoffe.dev</p>
								</Button>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default AboutModal;
