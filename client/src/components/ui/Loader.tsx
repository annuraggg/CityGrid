import { ReloadIcon } from "@radix-ui/react-icons";

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <ReloadIcon className="animate-spin w-7 h-7" />
    </div>
  );
};

export default Loader;
