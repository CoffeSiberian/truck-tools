import OptionCard from "../../../components/OptionCard";

// images
import testImage from "../../../static/img/testimg.webp";

// modals
import ModifyWeight from "./Modals/ModifyWeight";
import UnlockTrailers from "./Modals/UnlockTrailers";

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
    ];

    return (
        <div className="flex gap-4 flex-col">
            <div className="grid grid-cols-2 my-4 gap-4">
                {items.map((item) => {
                    return (
                        <>
                            <OptionCard
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                image={item.image}
                                footerJsx={item.modal}
                            />
                        </>
                    );
                })}
            </div>
        </div>
    );
};

export default TrailersOptions;
