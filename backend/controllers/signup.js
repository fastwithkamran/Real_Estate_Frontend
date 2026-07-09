const User = require("../models/user");

const handleUserSignUp = async (req, res) => {
  try {
    const { fullName, email, password, cnic, phone, role } = req.body;

    const avatorUrl = req.file ? req.file.secure_url : "https://www.google.com/imgres?q=avatorurl&imgurl=https%3A%2F%2Fimg.magnific.com%2Fpremium-photo%2Fhuman-resources-manager-digital-avatar-generative-ai_934475-9192.jpg%3Fsemt%3Dais_hybrid%26w%3D740%26q%3D80&imgrefurl=https%3A%2F%2Fwww.magnific.com%2Ffree-photos-vectors%2Favatar&docid=ZoMniqxlLaLBzM&tbnid=1W8MKrDI-xCTnM&vet=12ahUKEwitru-F0sKVAxW4VqQEHfcLE6sQnPAOegQILxAA..i&w=740&h=740&hcb=2&ved=2ahUKEwitru-F0sKVAxW4VqQEHfcLE6sQnPAOegQILxAA";
    
    await User.create({
      fullName,
      email,
      phone,
      password,
      avator: avatorUrl,
    });

    return res.status(201).json({msg: "Account Created in Server"});
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Upload failed in Server" , error: error.message});
  }
};

module.exports = handleUserSignUp;
