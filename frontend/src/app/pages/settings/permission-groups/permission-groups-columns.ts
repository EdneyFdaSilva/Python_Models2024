export const permissionGroupColumns = () => {
  return [
    {
      data: 'name',
      title: 'Name',
    },
    {
      data: 'system',
      title: 'System?',
      render(data, type, row, meta) {
        if (data) {
          return 'Yes';
        } else {
          return 'No';
        }
      },
    },
    {
      data: null,
      title: '',
      render(data, type, row, meta) {
        return `<button
          view-permission-group-id="${data.id}"
          class="btn btn-outline-primary btn-sm"
          aria-hidden="true">
          <i
            class="fa fa-edit p-2"
            view-permission-group-id="${data.id}">
          </i>
        </button>
        <button
          class="btn btn-outline-danger btn-sm"
          aria-hidden="true">
          <i class="fa fa-trash p-2"></i>
        </button>`;
      },
    },
  ];
};
