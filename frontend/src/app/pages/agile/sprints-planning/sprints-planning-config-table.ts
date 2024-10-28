import moment from 'moment';

const defaultContentGeneral = '-';
const defaultContent = '';

export const SprintsPlanningConfig = () => {
  return [
    {
      title: 'Key',
      data: 'jiraKey',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Summary',
      data: 'summary',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Story Points',
      data: 'storyPoints',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Request Date',
      data: 'requestDate',
      render(data, type, row) {
        if (type === 'sort') {
          return data;
        }
        if (!data) {
          return '-';
        } else {
          return moment(data).format('DD-MM-YYYY');
        }
      },
      createdCell: function(td, cellData, rowData, row, col) {
        if (!cellData) {
          td.classList.add('text-center');
        }
      },
      defaultContent: defaultContent
    },
    {
      title: 'Manager',
      data: 'manager',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Owner',
      data: 'owner',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Module',
      data: 'module',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Area',
      data: 'area',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Operation',
      data: 'operation',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Priority',
      data: 'priority',
      defaultContent: defaultContentGeneral
    },
    {
      title: 'Sprint Review Date',
      data: 'releaseDate',
      render(data, type, row) {
        if (type === 'sort') {
          return data;
        }
        if (!data) {
          return '-';
        } else {
          return moment(data).format('DD-MM-YYYY');
        }
      },
      createdCell: function(td, cellData, rowData, row, col) {
        if (!cellData) {
          td.classList.add('text-center');
        }
      },
      defaultContent: defaultContent
    }
  ];
};
