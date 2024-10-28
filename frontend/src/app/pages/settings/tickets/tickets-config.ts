import moment from 'moment';

export const tableConfig = () => {
  return [
    {
      data: 'id',
      title: 'ID'
    },
    {
      data: 'title',
      title: 'Subject'
    },
    {
      data: 'priority',
      title: 'Priority'
    },
    {
      data: 'status',
      title: 'Status'
    },
    {
      data: 'ticketType',
      title: 'Type'
    },
    {
      data: 'menuModule',
      title: 'Module',
      defaultContent: '-'
    },
    {
      data: 'menuScreen',
      title: 'Screen',
      defaultContent: '-'
    },
    {
      data: 'menuOperation',
      title: 'Operation',
      defaultContent: '-'
    },
    {
      data: 'openDate',
      title: 'Request Date',
      render: (data, type) => {
        return type === 'sort' ? data : moment(data).format('DD-MMMM-YYYY');
      }
    },
    {
      data: 'userRequestName',
      title: 'User Request'
    },
    {
      data: null,
      title: '',
      render(data, type, row, meta) {
        return `<button
          view-ticket-id="${data.id}"
          class="btn btn-outline-primary btn-sm"
          aria-hidden="true">
          <i
            class="fas fa-eye p-2"
            view-ticket-id="${data.id}">
          </i>
        </button>`;
      }
    }
  ];
};

export const ticketType = [
  {
    name: 'Bug',
    value: 1,
    id: 'Bug',
    order: 1
  },
  {
    name: 'Improvement',
    value: 2,
    id: 'Improvement',
    order: 2
  },
  {
    name: 'New Feature',
    value: 3,
    id: 'Feature',
    order: 3
  },
  {
    name: 'Data Adjustment',
    value: 4,
    id: 'Adjustment',
    order: 4
  }
];

export const ticketTypeDropDown = () => {
  return {
    id: 'ticketType',
    name: 'TicketType',
    hasLabel: false,
    type: 'select',
    options: ticketType
  };
};

export const ticketPriorityDropDown = () => {
  return {
    id: 'ticketPriority',
    name: 'TicketPriority',
    hasLabel: false,
    type: 'select',
    options: [
      {
        name: 'Low',
        value: 1,
        id: 'low',
        order: 1
      },
      {
        name: 'Medium',
        value: 2,
        id: 'medium',
        order: 2
      },
      {
        name: 'High',
        value: 3,
        id: 'high',
        order: 3
      }
    ]
  };
};

export const ticketStatus = [
  {
    name: 'Open',
    value: 1,
    id: 'Open',
    order: 1
  },
  {
    name: 'Analyzing',
    value: 2,
    id: 'Analyzing',
    order: 2
  },
  {
    name: 'In Progress',
    value: 3,
    id: 'InProgress',
    order: 3
  },
  {
    name: 'Solved',
    value: 4,
    id: 'Done',
    order: 4
  }
  //,
  // {
  //   name: 'Reopen',
  //   value: 5,
  //   id: 'Reopen',
  //   order: 5
  // }
];
export const ticketStatusDropDown = () => {
  return {
    id: 'ticketStatus',
    name: 'TicketStatus',
    hasLabel: false,
    type: 'select',
    options: ticketStatus
  };
};

export const ticketResolutionDropDown = () => {
  return {
    id: 'ticketResolution',
    name: 'TicketResolution',
    hasLabel: false,
    type: 'select',
    options: [
      {
        name: 'Fixed',
        value: 2,
        id: 'fixed',
        order: 1
      },
      {
        name: 'Released',
        value: 4,
        id: 'released',
        order: 2
      },
      {
        name: 'Not a Defect',
        value: 3,
        id: 'notdefect',
        order: 3
      },
      {
        name: 'Canceled',
        value: 1,
        id: 'canceled',
        order: 4
      }
    ]
  };
};
