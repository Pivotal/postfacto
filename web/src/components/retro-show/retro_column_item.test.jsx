/*
 * Postfacto, a free, open-source and self-hosted retro tool aimed at helping
 * remote teams.
 *
 * Copyright (C) 2016 - Present Pivotal Software, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 *
 * it under the terms of the GNU Affero General Public License as
 *
 * published by the Free Software Foundation, either version 3 of the
 *
 * License, or (at your option) any later version.
 *
 *
 *
 * This program is distributed in the hope that it will be useful,
 *
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 *
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *
 * GNU Affero General Public License for more details.
 *
 *
 *
 * You should have received a copy of the GNU Affero General Public License
 *
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react';
import {mount} from 'enzyme';
import Scroll from 'react-scroll';
import {Dispatcher} from 'p-flux';
import '../../spec_helper';

import RetroColumnItem from './retro_column_item';
import GiphyText from './giphy_text';

describe('RetroColumnItem', () => {
  const retroId = 'retro-slug-123';
  const item = {
    id: 2,
    description: 'the happy retro item',
    vote_count: 1,
    category: 'happy',
    done: false,
  };
  const item_done = {
    id: 20,
    description: 'the discussed retro item',
    vote_count: 10,
    category: 'happy',
    done: true,
  };

  describe('on desktop', () => {
    let dom;

    beforeEach(() => {
      dom = mount(<RetroColumnItem retroId={retroId} item={item} highlighted_item_id={null} archives={false} isMobile={false}/>);
    });

    it('shows vote count and message', () => {
      expect(dom.find('.vote-count')).toIncludeText('1');
      expect(dom.find('.item-text')).toHaveText('the happy retro item');
    });

    describe('editing', () => {
      beforeEach(() => {
        dom.find('.item-edit i').simulate('click');
      });

      it('displays an edit menu', () => {
        expect(dom.find('.retro-item')).toHaveClassName('editing');
      });

      it('dispatches a delete action when delete button clicked', () => {
        dom.find('.edit-delete i').simulate('click');

        expect(Dispatcher).toHaveReceived({
          type: 'deleteRetroItem',
          data: {retro_id: retroId, item},
        });
      });

      it('does not highlight the item when clicking on the item description', () => {
        dom.find('.edit-text').simulate('click');

        expect(Dispatcher).not.toHaveReceived('highlightRetroItem');
      });

      describe('setting a non-empty value', () => {
        beforeEach(() => {
          dom.find('.edit-text textarea').simulate('change', {target: {value: 'an updated retro item'}});
        });

        it('updates the retro item when save button is clicked', () => {
          dom.find('.edit-save').simulate('click');

          expect(dom.find('.retro-item')).not.toHaveClassName('editing');
          expect(Dispatcher).toHaveReceived({
            type: 'updateRetroItem',
            data: {retro_id: retroId, item, description: 'an updated retro item'},
          });
        });

        it('updates the retro item when enter key is pressed', () => {
          dom.find('.edit-text textarea').simulate('keyPress', {key: 'Enter'});

          expect(dom.find('.retro-item')).not.toHaveClassName('editing');
          expect(Dispatcher).toHaveReceived({
            type: 'updateRetroItem',
            data: {retro_id: retroId, item, description: 'an updated retro item'},
          });
        });
      });

      describe('setting an empty value', () => {
        beforeEach(() => {
          dom.find('.edit-text textarea').simulate('change', {target: {value: ''}});
        });

        it('disables the Save button', () => {
          expect(dom.find('.edit-save')).toHaveClassName('disabled');
        });

        it('does not allow item to be updated', () => {
          dom.find('.edit-save').simulate('click');

          expect(Dispatcher).not.toHaveReceived('updateRetroItem');
        });
      });
    });

    it('dispatches a vote action when voted on', () => {
      dom.find('.item-vote-submit').simulate('click');

      expect(Dispatcher).toHaveReceived({
        type: 'voteRetroItem',
        data: {retro_id: retroId, item},
      });
    });

    it('highlights the item when text is clicked', () => {
      dom.find('.item-text button').simulate('click');

      expect(Dispatcher).toHaveReceived({
        type: 'highlightRetroItem',
        data: {retro_id: retroId, item},
      });
    });

    describe('another item is highlighted', () => {
      beforeEach(() => {
        dom = mount(<RetroColumnItem retroId={retroId} item={item} highlighted_item_id={5} archives={false} isMobile={false}/>);
      });

      it('contains additional class lowlight', () => {
        expect(dom.find('.retro-item')).toHaveClassName('lowlight');
      });

      it('hides edit button', () => {
        expect(dom.find('.item-edit i')).not.toExist();
      });
    });

    it('scrolls to the centre of the screen when highlighted', () => {
      jest.spyOn(Scroll.scroller, 'scrollTo').mockReturnValue(null);

      expect(dom.find('.retro-item')).not.toHaveClassName('highlight');

      dom.setProps({highlighted_item_id: 2});

      expect(dom.find('.retro-item')).toHaveClassName('highlight');
      expect(Scroll.scroller.scrollTo).toHaveBeenCalledWith('retro-item-2', expect.objectContaining({
        delay: 0,
        duration: 300,
      }));
    });

    describe('highlighted items', () => {
      beforeEach(() => {
        dom = mount(<RetroColumnItem retroId={retroId} item={item} highlighted_item_id={2} archives={false} isMobile={false}/>);
      });

      it('is marked as highlight', () => {
        expect(dom.find('.retro-item')).toHaveClassName('highlight');
      });

      it('does not scroll when highlighted again', () => {
        jest.spyOn(Scroll.scroller, 'scrollTo').mockReturnValue(null);

        dom.setProps({highlighted_item_id: 2});
        expect(Scroll.scroller.scrollTo).not.toHaveBeenCalled();
      });

      it('unhighlights when text is clicked', () => {
        dom.find('.item-text button').simulate('click');

        expect(Dispatcher).toHaveReceived({
          type: 'unhighlightRetroItem',
          data: {retro_id: retroId},
        });
      });

      it('sets to discussed when done is clicked', () => {
        dom.find('.item-done').simulate('click');

        expect(Dispatcher).toHaveReceived({
          type: 'doneRetroItem',
          data: {retroId, item},
        });
      });

      it('unhighlights when cancel is clicked', () => {
        dom.find('.retro-item-cancel').simulate('click');

        expect(Dispatcher).toHaveReceived({
          type: 'unhighlightRetroItem',
          data: {retro_id: retroId},
        });
      });
    });

    describe('done items', () => {
      beforeEach(() => {
        dom = mount(<RetroColumnItem retroId={retroId} item={item_done} highlighted_item_id={null} archives={false} isMobile={false}/>);
      });

      it('is marked discussed', () => {
        expect(dom.find('.retro-item')).toHaveClassName('discussed');
      });

      it('hides the edit button', () => {
        expect(dom.find('.item-edit')).not.toExist();
      });

      it('dispatches undoneRetroItem when cancel is clicked', () => {
        dom = mount(<RetroColumnItem retroId={retroId} item={item_done} highlighted_item_id={20} archives={false} isMobile={false}/>);

        dom.find('.retro-item-cancel').simulate('click');

        expect(Dispatcher).toHaveReceived({
          type: 'undoneRetroItem',
          data: {item: item_done, retroId},
        });
      });
    });
  });

  describe('archive mode', () => {
    let dom;

    beforeEach(() => {
      dom = mount(<RetroColumnItem retroId={retroId} item={item} highlighted_item_id={null} archives isMobile={false}/>);
    });

    it('does not highlight clicked items', () => {
      dom.find('.item-text button').simulate('click');
      expect(Dispatcher).not.toHaveReceived('highlightRetroItem');
    });

    it('does not record votes', () => {
      dom.find('.item-vote-submit').simulate('click');
      expect(Dispatcher).not.toHaveReceived('voteRetroItem');
    });

    it('does not allow deletion', () => {
      expect(dom.find('.item-delete')).not.toExist();
    });
  });

  describe('on mobile', () => {
    it('does not highlight clicked items', () => {
      const dom = mount(<RetroColumnItem retroId={retroId} item={item} highlighted_item_id={null} archives={false} isMobile/>);
      dom.find('.item-text button').simulate('click');
      expect(Dispatcher).not.toHaveReceived('highlightRetroItem');
    });

    it('does not mark items as done', () => {
      const dom = mount(<RetroColumnItem retroId={retroId} item={item} highlighted_item_id={2} archives={false} isMobile/>);
      dom.find('.item-done').simulate('click');
      expect(Dispatcher).not.toHaveReceived('doneRetroItem');
    });
  });

  it('renders the description in a giphy tag', () => {
    const dom = mount(<RetroColumnItem retroId={retroId} item={item} highlighted_item_id={2} archives={false} isMobile/>);
    const giphy = dom.find(GiphyText);

    expect(giphy.prop('retroId')).toEqual(retroId);
    expect(giphy.prop('value')).toEqual(item.description);
  });
});
