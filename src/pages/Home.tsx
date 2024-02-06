import { Button } from "@mui/material";
import Parse from "parse";

const Home = () => {
  const handleClick = async () => {
    const result = await Parse.Cloud.run("sum", { x: 2, y: 4 });
    console.log('result: ', result);
  }
  return (
    <div css={{ minHeight: "100vh", position: "relative" }} className="flexColumn">
      <Button onClick={handleClick}>
        Test cloud function
      </Button>
    </div>
  )
}

export default Home