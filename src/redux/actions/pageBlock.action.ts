import Parse, { Attributes } from 'parse';

import { actionWithLoader } from '@/utils/app.utils';

import { AppDispatch, AppThunkAction, RootState } from '@/redux/store';

import { PATH_NAMES } from '@/utils/pathnames';
import { deletePageBlockSlice, getPagePageSelector, loadPageSlice } from '../reducers/page.reducer';
import i18n from '@/config/i18n';
import { IPageBlocksInput } from '@/types/page.type';
import { getRoleCurrentUserRolesSelector } from '../reducers/role.reducer';
import { canAccessTo } from '@/utils/role.utils';
import { convertIdToPointer, setValues } from '@/utils/parse.utils';
import { setMessageSlice } from '../reducers/app.reducer';
import { getPage } from './page.action';
import { goToNotFound } from './app.action';
import { uploadFileAPI } from '@/utils/file.utils';

const PageBlock = Parse.Object.extend("PageBlock");

const PAGE_BLOCK_PROPERTIES = new Set(['translated', 'image', 'imagePosition']);
const PAGE_PROPERTIES = new Set(['blocks']);

export const getPageBlock = async (id: string, include: string[] = []): Promise<Parse.Object | undefined> => {
  const block = await new Parse.Query(PageBlock)
    .equalTo('objectId', id)
    .notEqualTo('deleted', true)
    .include(include)
    .first();

  if (!block) {
    throw new Error(i18n.t('cms:errors.pageNotFound'));
  }
  return block;
}

// ----------------------------------------------------- //
// ------------------- Redux Actions ------------------- //
// ----------------------------------------------------- //


export const addBlocksToPage = (
  pageId: string,
  values: IPageBlocksInput,
  type: 'creation' | 'update' = 'creation'
): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const newValues = { ...values };
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Page', 'update');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToUpdate', { value: i18n.t('cms:thisPage') }));
    }

    const currentUser = await Parse.User.currentAsync();

    if (!currentUser) {
      throw Error(i18n.t('user:errors.userNotExist'));
    }

    const newBlocks = [];
    for (const block of newValues.blocks) {
      const blockObj = new PageBlock();

      if (block.image) {
        const uploadInput = {
          folder: 'pages',
          sessionToken: currentUser.getSessionToken(),
          file: block.image
        };
        const uploadedFileUrl = await uploadFileAPI(uploadInput);
        block.image = uploadedFileUrl;
      }

      const newValues = { ...block };

      setValues(blockObj, newValues, PAGE_BLOCK_PROPERTIES);
      newBlocks.push(blockObj);
    }

    const savedBlocks = await Parse.Object.saveAll(newBlocks);

    const savedValues = { blocks: savedBlocks };
    const page = convertIdToPointer('Page', pageId);
    
    setValues(page, savedValues, PAGE_PROPERTIES);

    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    const savedPage = await page.save();
    dispatch(loadPageSlice((savedPage as Attributes).toJSON()));
    if (type === 'creation') {
      dispatch(setMessageSlice(i18n.t('cms:messages.blocksAddedToThePage')));
      return;
    }
    dispatch(setMessageSlice(i18n.t('cms:messages.blocksEditedForThisPage')));
  });
};

/**
 * for user security reason, we do not delete the data from db
 * instead we just add a field "deleted" = true
 * @param id
 * @param redirectToRecycleBin redirect to recycle bin after the request is deleted
 * @returns
 */
export const deletePage = (id: string,): any => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    const state = getState?.();
    // --------- access --------- //
    const roles = getRoleCurrentUserRolesSelector(state as any);
    const hasRight = canAccessTo(roles, 'Page', 'delete');

    if (!hasRight) {
      throw Error(i18n.t('common:errors.hasNoRightToDelete', { value: i18n.t('cms:thisPage') }));
    }

    // --------- request --------- //
    const block = await getPageBlock(id);
    if (!block) return;

    // --------- update database --------- //
    // only the user or the MasterKey can update or deleted its own account
    // the master key can only accessible in server side
    // so we use the parse cloud function to do that, instead of a REST API
    // you can sse the cloud function in server in the /cloud/hooks/users.js file
    block.set('deleted', true);
    const deletedBock = await block.save();

    // --------- update store --------- //
    dispatch(deletePageBlockSlice([deletedBock.id]));
  });
};

export const onAddPageBlocksEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    if (!route.params?.pageId) {
      route.navigate(goToNotFound());
      return;
    } ;

    const state = getState?.();
    // --------- access --------- //
    let page = getPagePageSelector(state as any);

    if (!page) {
      const pageObject = await getPage(route.params.pageId, ['blocks']);
      if (pageObject) {
        page = (pageObject as Parse.Attributes).toJSON();
      }
    }

    if (!page) {
      route.navigate(goToNotFound());
      return;
    }

    if (page.blocks && page.blocks.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      route.navigate(goToEditPageBlocks(page.objectId));
      return;
    }

    dispatch(loadPageSlice(page));
  });
};

export const onEditPageBlocksEnter = (route?: any): AppThunkAction => {
  return actionWithLoader(async (dispatch: AppDispatch, getState?: () => RootState): Promise<void> => {
    if (!route.params?.pageId) {
      route.navigate(goToNotFound());
      return;
    }

    const state = getState?.();
    // --------- access --------- //
    let page = getPagePageSelector(state as any);

    if (!page) {
      const pageObject = await getPage(route.params.pageId, ['blocks']);
      if (pageObject) {
        page = (pageObject as Parse.Attributes).toJSON();
      }
    }

    if (!page) {
      route.navigate(goToNotFound());
      return;
    };

    dispatch(loadPageSlice(page));
  });
};

// --------------------------------------- //
// ------------- redirection ------------- //
// --------------------------------------- //
export const goToAddPageBlocks = (pageId: string) => {
  return {
    to: PATH_NAMES.pages + '/$pageId/' + PATH_NAMES.blocks + '/' + PATH_NAMES.create,
    params: { pageId },
  }
};

export const goToEditPageBlocks = (pageId: string) => {
  return {
    to: PATH_NAMES.pages + '/$pageId/' + PATH_NAMES.blocks + '/' + PATH_NAMES.edit,
    params: { pageId }
  }
};
