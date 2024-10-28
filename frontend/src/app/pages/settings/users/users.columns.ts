export const hpUserColumns = () => {
  return [
    {
      data: 'userRealName',
      title: 'Name'
    },
    {
      data: 'email',
      title: 'E-mail'
    },
    {
      data: 'phone',
      title: 'Phone'
    },
    {
      data: 'function',
      title: 'Function'
    },
    {
      data: 'country',
      title: 'Country'
    },
    {
      data: 'company',
      title: 'Company'
    },
    {
      data: 'area',
      title: 'Area'
    },
    {
      data: 'managerName',
      title: 'Manager'
    },
    {
      data: 'managerEmail',
      title: 'Manager E-mail'
    },
    {
      data: 'enabled',
      title: 'Enabled',
      render(data, type, row, meta) {
        return data ? 'Yes' : 'No';
      }
    },
    {
      data: null,
      title: '',
      render(data, type, row, meta) {
        return `<button
          view-user-id="${data.id}"
          class="btn btn-outline-primary btn-sm"
          aria-hidden="true">
          <i
            class="fa fa-edit p-2"
            view-user-id="${data.id}">
          </i>
        </button>
        <button
          class="btn btn-outline-danger btn-sm"
          aria-hidden="true">
          <i class="fa fa-trash p-2"></i>
        </button>`;
      }
    }
  ];
};
