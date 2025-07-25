import Lottie from 'react-lottie';
import { animationDefaultOptions } from '../../../../lib/utils';

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 bg-[#111] md:flex flex-col justify-center items-center hidden">
      <Lottie
        isClickToPauseDisabled={true}
        height={200}
        width={200}
        options={animationDefaultOptions}
      />
      <div className="text-gray-300 flex flex-col gap-5 items-center mt-10 text-center">
        <h3 className="poppins-medium text-2xl lg:text-4xl">
          Hey there<span className="text-white">! </span>
          Who<span className="text-white">'s</span> online
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;