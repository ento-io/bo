import { css, cx } from '@emotion/css';
import { Theme } from '@emotion/react';
import { FormHelperText, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { Color } from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import TipTapTypography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import {
  useEditor,
  EditorContent,
  EditorOptions,
  AnyExtension,
  FloatingMenu,
  BubbleMenu,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { useEffect, useState, SyntheticEvent } from 'react';
import Heading from '@tiptap/extension-heading';
import { useTranslation } from 'react-i18next';
import MenuBar from './MenuBar';

const classes = {
  editorRoot: (theme: Theme) => ({
    [theme.breakpoints.down('md')]: {
      paddingBottom: 40,
    },
  }),
  editor: (theme: Theme) => ({
    '& .mention': {
      backgroundColor: theme.palette.grey[200],
      paddingLeft: 6,
      paddingRight: 6,
      paddingBottom: 3,
      borderRadius: 12,
      fontWeight: 300,
      color: '#000',
      textDecoration: 'none',
    },
  }),
  input: (theme: Theme, editable = true) =>
    css({
      borderRadius: 6,
      border: editable ? '1px solid ' + theme.palette.grey[800] : 'none',
      paddingLeft: editable ? 16 : 0,
      paddingRight: editable ? 16 : 0,
      minHeight: editable ? 150 : 'initial',
      '& p.is-editor-empty:first-child::before': {
        content: 'attr(data-placeholder)',
        float: 'left',
        height: 0,
        pointerEvents: 'none',
        color: theme.palette.grey[300],
        fontFamily: 'Product Sans Regular',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '157.143%' /* 157.143% */,
      },
    }),
  label: (theme: Theme) => ({
    pointerEvents: 'none' as const,
    color: theme.palette.grey[800],
    // fontFamily: 'Product Sans Regular',
    // fontSize: 10,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 1,
    // backgroundColor: '#fff',
    zIndex: 100,
    padding: '4px 3px',
    marginBottom: 6,
  }),
  menu: (theme: Theme) => ({
    [theme.breakpoints.down('md')]: {
      position: 'absolute' as const,
      top: 0,
      // bottom: 0,
      // left: -LAYOUT_CONTENT_PADDING,
      // right: -LAYOUT_CONTENT_PADDING,
      // maxWidth: `calc(100vw + ${LAYOUT_CONTENT_PADDING / 2}px)`,
    },
  }),
  required: {
    marginRight: 6,
    marginLeft: 6,
  },
  tabs: {
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: 'transparent',
    },
  },
  tab: (theme: Theme) => ({
    textTransform: 'none' as const,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&.Mui-selected': {
      color: '#000',
      backgroundColor: '#ededed',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2,
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  })
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as any),
  Document,
  Paragraph,
  Text,
  TipTapTypography,
  Underline,
  Link.configure({
    HTMLAttributes: {
      // Change rel to different value
      // Allow search engines to follow links(remove nofollow)
      rel: 'noopener noreferrer',
      // Remove target entirely so links open in current tab
      target: null,
    },
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Heading.configure({
    HTMLAttributes: {
      class: 'custom-heading',
    },
    levels: [1, 2, 3],
  })
];

export type TextEditorProps = {
  placeholder?: string;
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  menuClassName?: string;
  required?: boolean;
  withFloatingButtons?: boolean;
} & Partial<EditorOptions>;

const TextEditor = ({
  placeholder,
  label,
  error,
  onChange,
  className,
  value,
  menuClassName,
  required,
  editable = true,
  withFloatingButtons = false,
  ...editorOptions
}: TextEditorProps) => {
  const [tab, setTab] = useState<'editor' | 'preview'>('editor');

  const theme = useTheme();
  const { t } = useTranslation();

  const handleTabChange = (_: SyntheticEvent, value: 'editor' | 'preview') => setTab(value);

  const editor = useEditor({
    // editable,
    // content: value,
    // editorProps: {
    //   attributes: {
    //     class: classes.input(theme, editable),
    //   },
    // },
    extensions: [
      // StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      ...extensions,
    ] as AnyExtension[],
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    ...editorOptions,
  });

  // use in useEffect because the editor is not available at the time of initialization in edition
  useEffect(() => {
    if (!(editor && value)) return;
    editor.commands.setContent(value);
    // !important: to avoid update for each taping, the value should be excluded from the dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  /**
   * change the editable state of the editor on the fly
   * for every tab change
   */
  useEffect(() => {
    // preview tab or not editable
    if (!editable) {
      editor?.setOptions({
        editable: false,
        editorProps: {
          attributes: {
            class: classes.input(theme, false),
          },
        },
      });
      return;
    };

    // editor tab
    editor?.setOptions({
      editable: tab === 'editor',
      editorProps: {
        attributes: {
          class: classes.input(theme, tab === 'editor'),
        },
      },
    });
  }, [editor, tab, editable, theme]);

  // preview
  if (!editable) {
    return <EditorContent editor={editor} className={className} />;
  }

  return (
    <div>
      {/* ----------- tabs ----------- */}
      {label && (
        <Typography css={classes.label}>
          {label}
          {required && <span css={classes.required}>{t('required')}</span>}
        </Typography>
      )}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        css={classes.tabs}
      >
        <Tab css={classes.tab} label="Editor" value="editor" />
        <Tab css={classes.tab} label="Preview" value="preview" />
      </Tabs>
      {tab === 'editor'
        ? (
          <div className={cx('positionRelative flexColumn', className)} css={classes.editorRoot}>
            <div className="positionRelative stretchSelf">
              {editor && withFloatingButtons && (
                <FloatingMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <MenuBar
                    editor={editor}
                  />
                </FloatingMenu>
              )}
              {editor && (
                <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <MenuBar
                    editor={editor}
                  />
                </BubbleMenu>
              )}
              {/* editor */}
              <EditorContent editor={editor} css={classes.editor} />
              {error && (
                <FormHelperText error css={{ paddingTop: 4, paddingBottom: 4 }}>
                  {error}
                </FormHelperText>
              )}
            </div>
            {editor && (
              <div css={classes.menu} className={menuClassName}>
                <MenuBar
                  editor={editor}
                  className="stretchSelf"
                />
              </div>
            )}
          </div>
        ) : (
          <EditorContent editor={editor} className={className} />
        )
      }
  
    </div>
  );
};

export default TextEditor;
