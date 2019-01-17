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

import {useRouter} from './use_router';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import '../spec_helper';

describe('#useRouter', () => {
  let routeSpy;

  beforeEach(() => {
    routeSpy = jasmine.createSpy('route');

    const Application = ({router}) => {
      router.get('/test', routeSpy);
      return (
        <div className="application">
          <button onClick={() => router.navigate('/test')}>Route</button>
        </div>
      );
    };
    Application.propTypes = {
      router: PropTypes.object.isRequired
    };

    const TestRouter = useRouter(Application);
    ReactDOM.render(<TestRouter/>, root);
  });

  it('routes', () => {
    $('.application button').simulate('click');
    expect(routeSpy).toHaveBeenCalled();
  });
});