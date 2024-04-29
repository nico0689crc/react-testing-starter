import SkeletonComponent from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Skeleton = () => {
  return (
    <SkeletonComponent containerTestId="skeleton-loader"/>
  );
};

export default Skeleton;