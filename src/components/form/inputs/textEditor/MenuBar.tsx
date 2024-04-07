import { css, cx } from '@emotion/css';
import { Theme } from '@emotion/react';
import { IconButton } from '@mui/material';
import { Editor } from '@tiptap/react';

import LinkButton from './LinkButton';

const classes = {
  menu: (theme: Theme) => ({
    border: '1px solid ' + theme.palette.grey[100],
    borderLeft: 'none', // because of sparkles button background
  }),
  button: (isActive: boolean) => (theme: Theme) => ({
    borderRadius: 0,
    border: 'none',
    cursor: 'pointer',
    height: 24,
    width: 24,
    padding: 18,
    backgroundColor: isActive ? theme.palette.grey[200] : '#fff',
  }),
  bordered: (theme: Theme) => {
    const borderColor = theme.palette.grey[100];
    return {
      borderRight: '1px solid ' + borderColor,
      borderLeft: '1px solid ' + borderColor,
    };
  },
  tabsContainer: {
    height: 'auto',
    borderBottom: 'none',
  },
  tabs: (theme: Theme) =>
    css({
      '& .MuiTabs-flexContainer': {
        gap: 8,
        paddingLeft: 16,
        paddingRight: 16,
      },
      backgroundColor: theme.palette.primary.light,
      borderRadius: 0,
      paddingLeft: 0,
      paddingRight: 0,
      height: 48,
    }),
  tab: (theme: Theme) =>
    css({
      color: theme.palette.grey[800],
      backgroundColor: '#fff',
      fontSize: 14,
      lineHeight: 1,
      minHeight: 'initial',
      flex: 'none !important',
      padding: '9px 12px',
    }),
  tabsContent: css({
    maxWidth: '100vw',
  }),
};

// to avoid type error
const getFocus = (editor: Editor) => editor.chain().focus() as any;
const canRunOnFocus = (editor: Editor) => editor.can().chain().focus() as any;

type Props = {
  editor: Editor;
  className?: string;
};

const MenuBar = ({ editor, className }: Props) => {
  return (
    <div>
      <div className={cx('flexRow', className)} css={classes.menu}>
        {[1, 2, 3].map((heading) => (
          <IconButton
            key={heading}
            onClick={() => getFocus(editor).toggleHeading({ level: heading }).run()}
            disabled={!canRunOnFocus(editor).toggleHeading({ level: heading }).run()}
            css={classes.button(editor.isActive('heading', { level: heading }))}>
            <span>H{heading}</span>
          </IconButton>
        
        ))}
        <IconButton
          onClick={() => getFocus(editor).toggleBold().run()}
          disabled={!canRunOnFocus(editor).toggleBold().run()}
          css={classes.button(editor.isActive('bold'))}>
          <img alt="bold" src="/icons/bold.svg" />
        </IconButton>
        <IconButton
          onClick={() => getFocus(editor).toggleItalic().run()}
          disabled={!canRunOnFocus(editor).toggleItalic().run()}
          css={classes.button(editor.isActive('italic'))}>
          <img alt="italic" src="/icons/italic.svg" />
        </IconButton>
        <IconButton
          onClick={() => getFocus(editor).toggleStrike().run()}
          disabled={!canRunOnFocus(editor).toggleStrike().run()}
          css={classes.button(editor.isActive('strike'))}>
          <img alt="strike" src="/icons/strike.svg" />
        </IconButton>
        <IconButton
          onClick={() => getFocus(editor).toggleUnderline().run()}
          disabled={!canRunOnFocus(editor).toggleUnderline().run()}
          css={classes.button(editor.isActive('underline'))}>
          <img alt="underline" src="/icons/underline.svg" />
        </IconButton>
        <IconButton
          onClick={() => getFocus(editor).toggleBulletList().run()}
          disabled={!canRunOnFocus(editor).toggleBulletList().run()}
          css={[classes.button(editor.isActive('bulletList')), classes.bordered]}>
          <img alt="bullet-list" src="/icons/bullet-list.svg" />
        </IconButton>
        <LinkButton editor={editor} css={[classes.button(editor.isActive('link')), classes.bordered]} />
      </div>
    </div>
  );
};

export default MenuBar;
