<template>
<div :tabindex="isOpen ? -1 : 0"
     :class="{ open: isOpen }"
     @focus.stop="open"
     class="search-container"
     ref="body">

  <div class="search-query" @click.stop="open">
    <input :id="uid"
           :name="identifier"
           :placeholder="searchHelpText"
           :data-autofocus="autofocus"
           autocomplete="off"
           type="search"
           ref="input"
           v-model="query"
           @focus.stop="open"
           @keydown.esc.stop.prevent="onEsc"
           @keydown.tab="onTab"
           @keydown.enter.stop.prevent="onEnter"
           @keydown.up.prevent="onUp"
           @keydown.down.prevent="onDown"
           @blur="debouncedClose()">
    <i class="fa fa-fw fa-circle-o-notch fa-spin" v-show="suggesting"></i>
  </div>

  <ul class="search-suggestions" v-show="isOpen" ref="options">
    <li v-if="noResults" class="search-suggestion not-found">
      <slot name="not-found">
        <span>No results for: {{ query }}</span>
      </slot>
    </li>
    <li v-for="option of options"
        class="search-suggestion"
        :class="{ active: $index === index }"
        @click.stop="select(option)"
        @mouseover="index = null">
      <slot :name="`suggestion-${option.id}`">
        <span>{{ option.name | highlight }}</span>
      </slot>
    </li>
  </ul>
</div>
</template>

<script lang="babel">
import Sifter from 'sifter';
import isString from 'lodash/isString';
import each from 'lodash/each';
import { escapeHtml as e } from '../util';

export default {
  props: {
    value: {
      required: true,
    },
    suggestions: {
      required: true,
      type: Array,
    },
    sortFields: {
      type: Array,
      default: () => [],
    },
    searchFields: {
      type: Array,
      default: () => ['name'],
    },
    limit: {
      type: Number,
      default: 15,
    },
  },
  data() {
    return {
      query: '',
      index: null,
      isOpen: false,
      skipClose: false,
      pendingSearches: 0,
      ignoreValueChange: false,
    };
  },
  computed: {
    searchable() {
      const suggestions = this.suggestions;

      return new Sifter(suggestions || []);
    },
    options() {
      const query = this.query;
      const searchable = this.searchable;
      const fields = this.searchFields;
      const sort = this.sortFields;
      const limit = this.limit;

      if (!query.trim().length) {
        return this.suggestions;
      }

      const results = searchable.search(query, {
        fields,
        sort,
        limit,
        sort_empty: [{ field: 'name', direction: 'asc' }],
      });

      const filtered = [];
      each(results.items, ({ id }) => {
        if (this.suggestions[id]) {
          filtered.push(this.suggestions[id]);
        }
      });

      return filtered;
    },
    noResults() {
      const options = this.options;
      const query = this.query;

      return query.trim().length > 0 && options.length === 0;
    },
    searchHelpText() {
      const search = this.search;
      const help = this.searchHelp;
      const placeholder = this.placeholderText;

      if (search) {
        return placeholder;
      }

      return help || this.$i18n.trans('components.select.help');
    },
    suggesting() {
      return this.pendingSearches > 0;
    },
  },
  filters: {
    highlight(content, query) {
      if (isString(content)) {
        const selected = query.trim().replace(/[\s]+/g, ' ').split(' ');
        let text = content;
        each(selected, (s) => {
          text = text.replace(new RegExp(`(${s.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'), '<b>$1</b>');
        });
        return text;
      }
      return content;
    }
  },
  methods: {
    onEnter() {
      if (this.index in this.options) {
        this.select(this.options[this.index]);
        return;
      }

      this.$debug(`search ${this.input}`);
      this.$emit('search', this.input);
    },
    onEsc() {
      if (this.$els.input) {
        this.$els.input.blur();
      }
      this.close();
    },
    onTab() {
      if (this.selectOnTab) {
        if (this.index >= 0) {
          this.select(this.tips[this.index]);
        }

        if (this.input.trim().length > 0 && this.tips.length > 0) {
          this.select(this.tips[0]);
          this.$nextTick(() => {
            this.input = '';
          });
        }
      }
    },
    onUp() {
      if (this.index === null) {
        this.index = this.canCreate ? -1 : this.tips.length - 1;
      } else if (this.canCreate && this.index > -1) {
        this.index = this.index - 1;
      } else if (this.index > 0) {
        this.index = this.index - 1;
      }

      this.scrollIntoView();
    },
    onDown() {
      if (this.index === null) {
        this.index = this.canCreate ? -1 : 0;
      } else if (this.index < (this.tips.length - 1)) {
        this.index = this.index + 1;
      }
      this.scrollIntoView();
    },
    scrollIntoView() {
      try {
        this.$els.options
                .children[this.canCreate ? this.index + 1 : this.index]
                .scrollIntoViewIfNeeded();
      } catch (e) {
        this.$debug(e);
      }
    },
    clickAway(e) {
      if (!this.$els.body.contains(e.target)) {
        this.close();
      }
    },
    close() {
      if (this.skipClose) {
        this.skipClose = false;
        return;
      }

      this.index = null;
      this.isOpen = false;
    },
    open() {
      if (this.isOpen) return;

      this.isOpen = true;

      this.$nextTick(() => {
        if (this.$els.input) {
          this.$els.input.focus();
        }
      });
    },
    select(option) {
      const item = isObject(option) ? option : this.tips[option];
      if (this.index !== null) this.index = null;
      if (!item) return;

      this.ignoreValueChange = true;
      if (this.multiple) {
        this.selected.$set(this.selected.length, option);
        this.skipClose = true;
        if (this.isOpen) this.$els.input.focus();
        this.value = map(this.selected, (s) => s[this.keyName]);
      } else {
        this.selected.splice(0, this.selected.length);
        this.selected.$set(0, option);
        if (this.isOpen) this.close();
        this.value = this.selected[0][this.keyName];
      }
      this.$dispatch('selected', item, this.selected);
      this.ignoreValueChange = false;
    },
    deselect(option) {
      this.selected.$remove(option);
    },
    createNewOption() {
      const text = this.input.trim();

      if (!text.length) return;

      const matches = filter(this.options, (option) => option[this.keyName] === text);
      if (matches.length === 0) {
        try {
          const option = this.creating(text);
          this.options.push(option);
          this.$nextTick(() => {
            this.select(option);
          });
        } catch (e) {
          this.$debug(e);
        }
      } else {
        this.select(matches[0]);
      }
      this.input = '';
    },
    renderingOption(option) {
      return this.renderOption({
        highlight: this.highlight,
        h: this.highlight,
        escape,
        e: escape,
        option,
        o: option,
      });
    },
    renderingItem(item) {
      return this.renderItem({
        highlight: this.highlight,
        h: this.highlight,
        escape,
        e: escape,
        item,
        i: item,
      });
    },
    renderingNoResults() {
      return this.renderNoResults({
        highlight: this.highlight,
        h: this.highlight,
        escape,
        e: escape,
        query: this.input,
        q: this.input,
      });
    },
    renderingCreate() {
      return this.renderCreate({
        highlight: this.highlight,
        h: this.highlight,
        escape,
        e: escape,
        text: this.input,
        t: this.input,
      });
    },
    highlight(content) {
      return highlight(content, this.input);
    },
  },
  watch: {
    input(value) {
      this.$dispatch('suggest', {
        value,
        start: () => {
          ++this.pendingSearches;
        },
        end: () => {
          if (this.pendingSearches > 0) {
            --this.pendingSearches;
          }
        },
      });
    },
    options(options) {
      const item = this.selected[0];
      if (item !== undefined) {
        const filtered = filter(options,
                (option) => option[this.keyName] === item[this.keyName]);

        if (!filtered.length) {
          this.deselect(item);
        } else {
          this.select(filtered[0]);
        }
      } else {
        const value = this.value;
        const filtered = filter(this.options, (option) => option[this.keyName] === value);
        if (filtered.length) {
          this.select(filtered[0]);
        }
      }
    },
    value(val) {
      if (!this.ignoreValueChange) {
        const matched = filter(this.options, (item) => item[this.keyName] === val);
        this.selected = matched;
      }
    },
  },
  mixins: [
    actionable,
    decorable,
    editable,
    eventable,
    validatable,
  ],
  ready() {
    const value = this.value;
    const filtered = filter(this.options, (option) => option[this.keyName] === value);
    if (filtered.length) {
      this.select(filtered[0]);
    }

    document.body.addEventListener('click', this.clickAway, false);
  },
  destroyed() {
    document.body.removeEventListener('click', this.clickAway, false);
  },
};
</script>


<style lang="scss">
@import "../styles/variables";

.select-container {
  display: block;
  width: 100%;
  position: relative;
  outline: none;
}

.select-selected {
  // <<-- Extend Bootstrap Form Control
  display: block;
  width: 100%;
  // // Make inputs at least the height of their button counterpart (base line-height + padding + border)
  // height: $input-height;
  font-size: $font-size-base;
  line-height: $input-line-height;
  color: $input-color;
  background-color: $input-bg;
  // Reset unusual Firefox-on-Android default style; see https://github.com/necolas/normalize.css/issues/214.
  background-image: none;
  background-clip: padding-box;
  border: $input-btn-border-width solid $input-border-color;
  // Note: This has no effect on <select>s in some browsers, due to the limited stylability of `<select>`s in CSS.
  @include border-radius($input-border-radius);
  @include box-shadow($input-box-shadow);
  @include transition(border-color ease-in-out .15s, box-shadow ease-in-out .15s);

  // Unstyle the caret on `<select>`s in IE10+.
  &::-ms-expand {
    background-color: transparent;
    border: 0;
  }

  // Customize the `:focus` state to imitate native WebKit styles.
  @include form-control-focus();

  // Placeholder
  &::placeholder {
    color: $input-color-placeholder;
    // Override Firefox's unusual default opacity; see https://github.com/twbs/bootstrap/pull/11526.
    opacity: 1;
  }

  // Disabled and read-only inputs
  //
  // HTML5 says that controls under a fieldset > legend:first-child won't be
  // disabled if the fieldset is disabled. Due to implementation difficulty, we
  // don't honor that edge case; we style them as disabled anyway.
  &:disabled,
  &[readonly] {
    background-color: $input-bg-disabled;
    // iOS fix for unreadable disabled content; see https://github.com/twbs/bootstrap/issues/11655.
    opacity: 1;
  }

  &:disabled {
    cursor: $cursor-disabled;
  }
  // -->> extended from bootstrap.
  cursor: pointer;
  position: relative;
  padding: $input-padding-y $input-padding-x + 1.5rem $input-padding-y $input-padding-x;
  &::before {
    display: inline-block;
    width: 0;
    height: 0;
    margin-right: .25rem;
    margin-left: .25rem;
    vertical-align: middle;
    content: "";
    border-top: $caret-width solid;
    border-right: $caret-width solid transparent;
    border-left: $caret-width solid transparent;
    position: absolute;
    right: .25rem;
    top: 50%;
  }

  list-style: none;
  margin-bottom: 0;
  &:empty {
    display: none;
  }
  .empty {
    color: $input-color-placeholder;
  }

  b {
    display: none;
  }
}

.select-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select-focus {
  clip: rect(0, 0, 0, 0);
  height: 0;
  width: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  top: -10px;
  z-index: -10;
}

.select-search {
  position: relative;
  i {
    position: absolute;
    right: $input-padding-x;
    top: $input-padding-y;
    z-index: 1000;
    color: black;
  }

  input {
    // <<-- Extend Bootstrap Form Control
    display: block;
    width: 100%;
    // // Make inputs at least the height of their button counterpart (base line-height + padding + border)
    // height: $input-height;
    padding: $input-padding-y $input-padding-x;
    font-size: $font-size-base;
    line-height: $input-line-height;
    color: $input-color;
    background-color: $input-bg;
    // Reset unusual Firefox-on-Android default style; see https://github.com/necolas/normalize.css/issues/214.
    background-image: none;
    background-clip: padding-box;
    border: $input-btn-border-width solid $input-border-color;
    // Note: This has no effect on <select>s in some browsers, due to the limited stylability of `<select>`s in CSS.
    @include border-radius($input-border-radius);
    @include box-shadow($input-box-shadow);
    @include transition(border-color ease-in-out .15s, box-shadow ease-in-out .15s);

    // Unstyle the caret on `<select>`s in IE10+.
    &::-ms-expand {
      background-color: transparent;
      border: 0;
    }

    // Customize the `:focus` state to imitate native WebKit styles.
    @include form-control-focus();

    // Placeholder
    &::placeholder {
      color: $input-color-placeholder;
      // Override Firefox's unusual default opacity; see https://github.com/twbs/bootstrap/pull/11526.
      opacity: 1;
    }

    // Disabled and read-only inputs
    //
    // HTML5 says that controls under a fieldset > legend:first-child won't be
    // disabled if the fieldset is disabled. Due to implementation difficulty, we
    // don't honor that edge case; we style them as disabled anyway.
    &:disabled,
    &[readonly] {
      background-color: $input-bg-disabled;
      // iOS fix for unreadable disabled content; see https://github.com/twbs/bootstrap/issues/11655.
      opacity: 1;
    }

    &:disabled {
      cursor: $cursor-disabled;
    }
    // -->> extended from bootstrap.
    border: none;
    position: absolute;
    border-left: 1px solid $input-border-color;
    border-right: 1px solid $input-border-color;
    left: 0;
    right: 0;
    z-index: 1000;
    background: #fff;
    border-radius: 0;
  }
}

.form-group-lg {
  .select-search {
    i {
      top: $input-padding-y-lg;
      right: $input-padding-x;
    }
    input {
      padding: $input-padding-y-lg $input-padding-lg;
    }
  }
}

.select-options {
  // <<--- Extend Bootstrap Drop Down
  position: absolute;
  top: 100%;
  left: 0;
  z-index: $zindex-dropdown;
  // display: none; // none by default, but block on "open" of the menu
  float: left;
  // min-width: $dropdown-min-width;
  // padding: $dropdown-padding-y 0;
  // margin: $dropdown-margin-top 0 0; // override default ul
  font-size: $font-size-base;
  color: $body-color;
  text-align: left; // Ensures proper alignment if parent has it changed (e.g., modal footer)
  list-style: none;
  background-color: $dropdown-bg;
  background-clip: padding-box;
  border: $dropdown-border-width solid $dropdown-border-color;
  @include border-radius($border-radius);
  @include box-shadow($dropdown-box-shadow);
  // --->> extended from bootstrap.

  display: block;
  right: 0;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 15rem;
  min-width: 0;
  margin: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-color: $input-border-color;
  border-top-width: 0;
}

.select-search + .select-options {
  border-top-width: 1px;
  margin: $input-line-height + 2 * $input-padding-y  + rem(-1px) 0 0;
}

.search {
  .select-search {
    height: $input-line-height + 2 * $input-padding-y;
  }
}

.search {
  .select-search + .select-options {
    border-top-width: 1px;
  }
}

.form-group-lg {
  .search {
    .select-search {
      height: $input-line-height + 2 * $input-padding-y-lg + rem(2px);
    }
  }
}

.form-group-lg {
  .search {
    .select-search + .select-options {
      border-top-width: 1px;
      margin: $input-line-height + 2 * $input-padding-y-lg  + rem(-1px) 0 0;
    }
  }
}

.select-option {
  // <<-- Extend Bootstrap Drop Down Item
  display: block;
  width: 100%; // For `<button>`s
  clear: both;
  font-weight: normal;
  color: $dropdown-link-color;
  text-align: inherit; // For `<button>`s
  white-space: nowrap; // prevent links from randomly breaking onto new lines
  background: none; // For `<button>`s
  border: 0; // For `<button>`s

  // Disabled state
  //
  // Gray out text and ensure the hover/focus state remains gray
  &.disabled {
    @include plain-hover-focus {
      color: $dropdown-link-disabled-color;
    }

    // Nuke hover/focus effects
    @include hover-focus {
      text-decoration: none;
      cursor: $cursor-disabled;
      background-color: transparent;
      background-image: none; // Remove CSS gradient
      @include reset-filter();
    }
  }
  // -->> extended from bootstrap.
  padding: $input-padding-y $input-padding-x;
  cursor: pointer;
  user-select: none;
  @include hover-focus {
    background-color: $state-info-bg;
    color: $state-info-text;
    text-decoration: none;
  }
  // Active state
  &.active {
    background-color: $state-info-bg;
    color: $state-info-text;
    text-decoration: none;
  }
}

.select-not-found {
  @include hover-focus {
    background-color: inherit;
    color: inherit;
  }
}

.select-container {
  &.open {
    .select-selected {
      border-color: $input-border-focus;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .select-search input {
      border-color: $input-border-color;
    }
  }
  &.search {
    .select-search {
      input {
        border: 1px solid $input-border-color;
      }
    }
    &.open {
      .select-search {
        position: initial;
        input {
          position: initial;
          border-color: $input-border-focus;
        }
        + .select-options {
          margin: 0;
          margin-top: 0;
        }
      }
    }
  }
}

.search .select-search input:focus {
  border: 1px solid $input-border-focus;
}

.has-success {
  .search .select-search, .select-selected {
    border-color: $brand-success;
  }
}

.has-warning {
  .search .select-search, .select-selected {
    border-color: $brand-warning;
  }
}

.has-danger {
  .search .select-search, .select-selected {
    border-color: $brand-danger;
  }
}
</style>
