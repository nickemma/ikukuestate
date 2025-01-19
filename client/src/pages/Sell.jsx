import ArticleSection from "../components/ArticleSection";
import FormContent from "../components/FormContent";

const Sell = () => {
  return (
    <div className="mt-20">
      <div className="relative flex justify-center items-center mb-8">
        <img
          src="/sell.jpg"
          alt={`Photo of sell`}
          className="shadow-lg w-full "
          loading="lazy"
        />
        {/* Text overlay - Top left */}
        <h1 className="absolute top-8 left-8 text-white text-4xl font-bold px-4 py-2">
          Selling Your Home with The Real Estate Company
        </h1>
      </div>
      <section className="flex flex-col items-center pt-16 pb-12 px-2 bg-gray-100">
        <p className="text-xl leading-9 text-start mb-8 max-w-[60rem]">
          Powered by market insights and our vast global reach, The Agency puts
          the resources of our entire team behind our clients to offer better
          representation, boutique service, and a true competitive edge. The
          Agency excels in the art of marketing and selling luxury real estate,
          having positioned and sold some of the world’s most iconic properties.
          We custom-tailor our strategies for your market and unique offering.
        </p>
        <h2 className="font-normal m-0 pb-4 mb-4 text-2xl text-center">
          <em>After all, more of the same is never an option.</em>
        </h2>
        <div className="flex flex-col md:flex-row justify-center w-full">
          <ArticleSection
            title="GLOBAL REACH"
            content="Our global presence allows us to tap into an international pool of buyers and agent referrals for our listings."
            className="mx-2"
          />
          <ArticleSection
            title="LEAD GENERATION"
            content="We don’t wait for buyers to come to us. Our technology identifies and captures qualified leads for our listings."
            className="mx-2"
          />
          <ArticleSection
            title="CONCIERGE SERVICE"
            content="Luxury isn’t a price. It’s an experience. And we’ve rekindled the art of white-glove client service at every price point."
            className="mx-2"
          />
        </div>
      </section>
      <FormContent />
    </div>
  );
};

export default Sell;
