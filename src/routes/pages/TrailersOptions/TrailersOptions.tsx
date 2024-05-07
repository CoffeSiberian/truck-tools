import OptionCard from "../../../components/OptionCard";

// images
import testImage from "../../../static/img/testimg.webp";

// modals
import ModifyWeight from "./Modals/ModifyWeight";
import UnlockTrailers from "./Modals/UnlockTrailers";
import ModifyTrailerWeight from "./Modals/ModifyTrailerWeight";

const TrailersOptions = () => {
    const items = [
        {
            id: "1",
            title: "Modify weight",
            description: "Modify the weight of the trailer",
            image: testImage,
            modal: <ModifyWeight />,
        },
        {
            id: "2",
            title: "Unlock Current Trailer",
            description: "Unlock the current trailer",
            image: testImage,
            modal: <UnlockTrailers />,
        },
        {
            id: "3",
            title: "Change trailer weight",
            description:
                "Changes the weight of the trailer. It does not change the trailer's load since it is different and it is only necessary to apply it once to the trailer.",
            image: testImage,
            modal: <ModifyTrailerWeight />,
        },
    ];

    return (
        <div className="flex gap-4 flex-col">
            <div className="grid grid-cols-2 my-4 gap-4">
                {items.map((item) => {
                    return (
                        <OptionCard
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            description={item.description}
                            image={item.image}
                            footerJsx={item.modal}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default TrailersOptions;
