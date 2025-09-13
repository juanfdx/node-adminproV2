
const getMenuFrontEnd = (role = 'USER_ROLE') => {

    const menu = [
    {
      id    : 1,
      title : 'Dashboard',
      icon  : 'dashboard',
      submenu: [
        { 
          id    : 1,
          title : 'Main', 
          url   : '/dashboard' 
        }
      ]
    },
    {
      id    : 2,
      title : 'Maintenance',
      icon  : 'folder',
      submenu: [
        // { id: 1, title: 'Users', url: 'users' },
        { 
          id    : 2,
          title : 'Hospitals', 
          url   : 'hospitals' 
        },
        { 
          id    : 3,
          title : 'Medics',
          url   : 'medics' 
        },
      ]
    }
  ];

  //si es admin agregamos users al submenu y lo podrá ver en el frontend
  if (role === 'ADMIN_ROLE') {
    menu[1].submenu.unshift({ id: 1, title: 'Users', url: 'users' });
  
  } 
  
  return menu;

}


module.exports = {
  getMenuFrontEnd
}
