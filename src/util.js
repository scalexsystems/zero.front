import _ from 'lodash';

export const bool = any => [true, 'true', 'yes', '1', 1].indexOf(any) > -1;

export const escapeHtml = (unsafeString) => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(unsafeString));
  return div.innerHTML;
};

// NOTICE: UNSAFE with unsafe strings; only use on previously-escaped ones!
export const unescapeHtml = (escapedString) => {
  const div = document.createElement('div');
  div.innerHTML = escapedString;
  const child = div.childNodes[0];

  return child ? child.nodeValue : '';
};

export const nl2br = content => content.replace(/\n/g, '<br>');

export const mapObject = (source, mappings) => {
  const output = {};

  if (_.isArray(mappings)) {
    _.each(mappings, (key) => {
      output[key] = source[key];
    });
  } else {
    _.each(mappings, (newKey, oldKey) => {
      output[newKey] = source[oldKey];
    });
  }

  return output;
};

export const pushIf = (target, items, mappings = {}) => {
  if (!_.isArray(items)) {
    return pushIf(target, [items], mappings);
  }

  items.forEach((item) => {
    if (item.id in mappings) return;

    /* eslint-disable */
    mappings[item.id] = target.length;
    /* eslint-enable */
    target.push(item);
  });

  return target;
};

export const isValidationException = (response) => {
  if (response.status === 422) return true;

  return true;
};

export const normalizeValidationErrors = (errors) => {
  const transformed = {};
  _.each(errors, (value, key) => {
    transformed[key] = (_.isArray(value) ? value.join(' ') : value);
  });
  return transformed;
};

export const httpThen = (response) => {
  if ('ok' in response) {
    if (response.ok === true) {
      return response.json();
    }

    throw response;
  }

  return response;
};
