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

import {Actions} from 'p-flux';

export default function fetchJson(url, {accessToken, headers, ...options} = {}) {
  const acceptHeaders = {'accept': 'application/json', 'Content-Type': 'application/json'};
  const authorizationHeaders = accessToken ? {authorization: `Bearer ${accessToken}`} : {};
  const augmentedOptions = {
    credentials: 'same-origin',
    headers: {...acceptHeaders, ...authorizationHeaders, ...headers},
    ...options,
  };

  return fetch(url, augmentedOptions)
    .then((response) => {
      if (response.status === 204) {
        return [response.status, ''];
      }
      if (response.status === 405) {
        return [response.status, ''];
      }
      return Promise.all([response.status, response.json()]);
    })
    .catch(() => {
      Actions.apiServerNotFound();
      return [];
    });
}
