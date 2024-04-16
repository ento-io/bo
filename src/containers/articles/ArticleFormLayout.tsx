import {
  Outlet,
} from "@tanstack/react-router";

const classes = {
  content: {
    maxWidth: 1000,
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}
const ArticleFormLayout = () => {
    return (
      <div className="stretchSelf">
        <div css={classes.content} className="flexColumn">
          <Outlet />
        </div>
      </div>
      )
}

export default ArticleFormLayout;