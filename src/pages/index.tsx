import { useState } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { Loader } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const catImages: string[] = [
  "https://cdn2.thecatapi.com/images/bpc.jpg",
  "https://cdn2.thecatapi.com/images/eac.jpg",
  "https://cdn2.thecatapi.com/images/6qi.jpg",
];

//レスポンスのデータ構造
interface CatCategory {
  id: number;
  name: string;
}

//レスポンスに含まれる猫画像の型
interface SearchCatImage {
  breeds: string[];
  categories: CatCategory[];
  id: string;
  url: string;
  width: number;
  height: number;
}

type SearchCatImageResponse = SearchCatImage[];

const randomCatImage = (): string => {
  const index = Math.floor(Math.random() * catImages.length);
  return catImages[index];
};

//1回目
// const fetchCatImage = async () => {
//   const res = await fetch("https://api.thecatapi.com/v1/images/search");
//   const result = await res.json();
//   return result[0];
// };

//2回目
const fetchCatImage = async (): Promise<SearchCatImage> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const result = (await res.json()) as SearchCatImageResponse;
  return result[0];
};

interface IndexPageProps {
  initialCatImageUrl: string;
}

// fetchCatImage().then((image) => {
//   console.log(`猫の画像: ${image.url}`);
// });

const IndexPage: NextPage<IndexPageProps> = ({ initialCatImageUrl }) => {
  //   const [catImageUrl, setCatImageUrl] = useState(
  //     "https://cdn2.thecatapi.com/images/bpc.jpg"
  //   );
  const [catImageUrl, setCatImageUrl] = useState(initialCatImageUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    const image = await fetchCatImage();
    setCatImageUrl(image.url);
    setIsLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h1>猫画像アプリ👋</h1>
      {isLoading ? (
        <>
          <Loader active inline="centered" size="huge" />
        </>
      ) : (
        <img src={catImageUrl} width={500} height="auto" />
      )}
      <button onClick={handleClick} style={{ marginTop: 18 }}>
        今日の猫さん
      </button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  IndexPageProps
> = async () => {
  const catImage = await fetchCatImage();
  return {
    props: {
      initialCatImageUrl: catImage.url,
    },
  };
};

export default IndexPage;
