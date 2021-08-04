function share() {
  const shareData = {
    title: "Add review for BPHC  Course",
    text: "View and add BPHC course reviews!",
    url: document.location,
  };
  console.log("Sharing", shareData);
  try {
    navigator.share(shareData).catch((err) => {
      alert(
        "Sharing not supported. Please copy page url and give it to your friend."
      );
    });
  } catch (err) {
    alert(
      "Sharing not supported. Please copy page url and give it to your friend."
    );
  }
}
