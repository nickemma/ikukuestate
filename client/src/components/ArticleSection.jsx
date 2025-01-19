import PropTypes from "prop-types";

const ArticleSection = ({ title, content }) => {
  return (
    <article className="flex flex-col items-center mb-8 mx-4 w-full md:w-1/3">
      <h3 className="font-normal m-0 mb-2 text-2xl text-center">{title}</h3>
      <p className="text-lg leading-6 px-4 text-justify">{content}</p>
    </article>
  );
};

ArticleSection.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default ArticleSection;
