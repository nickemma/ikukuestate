const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-red-500 border-solid"></div>
      <span className="ml-3 text-lg">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
