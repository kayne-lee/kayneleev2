import Modal from "@/components/shared/modal";
import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
} from "react";
import NUMERAI from "public/NumerAI.png"
import SMART from "public/Smart.png"
import BITCOIN from "public/BITCOIN.png"
import CAPTION from "public/Caption.png"
import Image from "next/image";

const Projects = ({
  showProjects,
  setShowProjects,
}: {
  showProjects: boolean;
  setShowProjects: Dispatch<SetStateAction<boolean>>;
}) => {
    const [project, setProject] = useState(PROJECTS[0]);
  return (
    <Modal showModal={showProjects} setShowModal={setShowProjects}>
      <div className="w-full overflow-hidden md:max-w-4xl md:rounded-2xl md:border md:border-gray-100 md:shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 bg-white px-4 py-6 pt-8 text-center md:px-16">
            <h3 className="font-display text-2xl font-bold">Projects</h3>
            <div className="bg-[#4A4A4A] w-[100%] h-0.5"></div>
            <div className="flex flex-row gap-3 flex-wrap justify-center align-center">
                <div className="flex flex-row gap-5 flex-wrap justify-center">
                    {PROJECTS.map((work) => (
                        <button
                          key={work.name}
                            className="text-xl"
                            onClick={() => {
                            setProject(work);
                            }}
                            style={{
                                borderBottom: project.name === work.name? "solid 2px #30A9EB": "solid 2px white" 
                            }}
                        >
                            {work.name}
                        </button>
                    ))}
                </div>
                <div className="flex flex-col w-[90%] border-[1px] rounded-[12px] shadow-md border-[#d3d3d3] p-4 items-center gap-2">
                  <h2 className="font-bold text-lg">{project.name}</h2>
                  <div className="flex flex-row justify-center gap-5">
                    {project.technologies.map((tech) => (
                      <div key={tech} className="border-2 rounded-xl border-gray-200 px-5">
                        <p>{tech}</p>
                      </div>
                      ))}
                   </div>
                   <div className="w-[90%] flex justify-center">
                    {project.highlights}
                  </div>
                  <a href={project.github} target="blank">
                    {project.video ? (
                      <video width="350" autoPlay loop>
                        <source src={`/${project.video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={`/${project.image}`}
                        alt={project.name}
                        width={200}
                        height={100}
                      />
                    )}
                  </a>
                </div>

            </div>
        </div>
      </div>
    </Modal>
  );
};

export function useProjects() {
  const [showProjects, setShowProjects] = useState(false);

  const DemoModalCallback = useCallback(() => {
    return (
      <Projects
        showProjects={showProjects}
        setShowProjects={setShowProjects}
      />
    );
  }, [showProjects, setShowProjects]);

  return useMemo(
    () => ({ setShowProjects, Projects: DemoModalCallback }),
    [setShowProjects, DemoModalCallback],
  );
}

export const PROJECTS = [
  {
    name: "Computer Vision Keyboard",
    technologies: ["Python", "CV2", "MediaPipe"],
    highlights: 
      "Developed a Python application using OpenCV and MediaPipe to facilitate hands-free typing by recognizing hand gestures through a webcam. Integrated a virtual keyboard interface to provide seamless and intuitive user interaction, leading to a 30% increase in typing speed for users with limited mobility. Engineered a robust hand detection system utilizing MediaPipe Hand landmarks to accurately calculate the distance between the index and middle fingers, mapping gestures to keyboard characters with 95% accuracy. The application includes predictive text and auto-correction features, enabling users to personalize the typing experience through customizable keyboard layouts, gesture sensitivity, and language support. The system's architecture ensures a high degree of accuracy and responsiveness, with a dynamic virtual keyboard that adapts to different hand gestures and language preferences.",
    video: "AIKEYBOARD.mp4",
    github: "https://github.com/kayne-lee/Computer-Vision-Keyboard",
  },
  {
    name: "Caption Generator",
    technologies: ["JSON", "AWS", "Next.js", "S3"],
    highlights: 
      "Developed a Next.js application facilitating user-generated video uploads, integrating AWS S3 for efficient media storage to enhance system performance and handling of high-resolution video content leading to 50% reduction in server load and a 20% increase in upload speed. Engineered a dynamic captioning feature utilizing AWS Transcribe Services enabling users to personalize captions by adjusting fonts, colors, and text positioning. The system’s architecture ensured a seamless process of video-to-text conversion, with an additional layer of stylization.",
    image: "Caption.png",
    github: "https://github.com/kayne-lee/Caption-Creator",
  },
    {
      name: "NumerAI Model",
      technologies: ["Python", "API"],
      highlights: 
        "Developped a ML model to participate in the NumerAI tournament to trade crypto currencies. Currently have a 12% profit and ranked top 25 in the season. Used NumerAI's API to parse and organize the data and then used a LightGBM model to process the data given by NumerAI.",
      image: "NumerAI.png",
      github: "https://github.com/kayne-lee/numerAIModel",
    },
    {
      name: "SmartPlate",
      technologies: ["Next.js", "OpenAI"],
      highlights: 
        "Created a Next.js application integrated with OpenAI API to create a budget friendly meal planner. Took data from the user and input into a GPT-3.5-Turbo model and output a list of meals along with ingredients and price of the meal. These ingredients could then be added to a grocery list where all the ingredients needed are stored along with total price, number of meals, and average cost per meal spent.",
      image: "Smart.png",
      github: "https://github.com/kayne-lee/smartplate",
    },
      {
      name: "Bitcoin Predictor",
      technologies: ["Python", "Jupyter Notebook"],
      highlights: 
        "Developed an algorithm to predict the future price of Bitcoin using historical price and sentimental data. This project used USD/BTC price from Yahoo Fincance, along with data from wikipedia about edits to the Bitcoin page. These datas were merged then used to train a random forest model then switched to XGBoost model to improve accuracy. Developped a backtesting system and use a robust error metric to determine if the algorithm is performing well. This system is also able to make next-day predictions.",
      image: "BITCOIN.png",
      github: "https://github.com/kayne-lee/bitcoin-predictor",
    },
    
  
  ];
  