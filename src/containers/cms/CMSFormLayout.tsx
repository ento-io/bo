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
const CMSFormLayout = () => {
    return (
      <div className="stretchSelf">
        <div css={classes.content} className="flexColumn">
          <Outlet />
        </div>
      </div>
      )
}

export default CMSFormLayout;