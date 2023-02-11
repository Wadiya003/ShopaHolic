import bcryptjs from "bcryptjs";
const data = {
  users:[
    {
      name:'weiwei',
      email:'test@gmail.com',
      password: bcryptjs.hashSync('123456'),
      isAdmin:true,

    },
    {
      name:'mimi',
      email:'user@gmail.com',
      password: bcryptjs.hashSync('654321'),
      isAdmin:false,

    }
  ],
  carouselImages:[
    {
      src:"https://carouselclothing.ca/userContent/images/Home%20Page%20Images/boutique_clothing_at_1_4th_the_price.jpg"
    },
    {
      src:"https://getnaturepositive.com/wp-content/uploads/Carousel-Copy-2.jpg"
    }
  ]

};

export default data;