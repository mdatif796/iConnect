// $('#user-img-input').change(function(){
//   const [file] = this.files[0];
//   console.log(file);
//   if (file) {
//     $('#user-img').attr('src', URL.createObjectURL(file));
//   }
// });

imgInp.onchange = evt => {
  const [file] = imgInp.files;
  console.log(file);
  if (file) {
    userImg.src = URL.createObjectURL(file);
    console.log(URL.createObjectURL(file));
  }
}