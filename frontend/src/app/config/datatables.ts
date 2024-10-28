import _ from 'lodash';

const defaultConfig: DataTables.Settings | any = {
  language: {
    search: '',
    searchPlaceholder: 'Search',
    processing: '<div class="loading-wrapper">Loading data... <i class="loading"></i></div>',
    emptyTable: 'No matching records found'
  },
  searching: true,
  paging: true,
};

export const datatablesConfig = (
  ...config: Array<DataTables.Settings>
): DataTables.Settings => {
  return _.assignIn({}, defaultConfig, ...config);
};
