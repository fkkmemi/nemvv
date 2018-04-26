exports.in = (req, res) => {
  const path = req.body.page;
  let to = true;

  switch (path) {
    case '/':
      break;
    case '/device':
      if (req.user.lv > 3) to = false;
      break;
    case '/firmware':
      if (req.user.lv > 3) to = false;
      break;
    case '/user':
      if (req.user.lv > 4) to = false;
      break;

    default : break;
  }
  // if (req.user.lv )
  res.send({ success: true, d: to });
};
