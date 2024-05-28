import { IconButton } from "@mui/material";

export default function OptsPage({ opts }) {
  const atags = opts.map((str) => {
    let href = str.replaceAll(" ", "");
    if (str === "Tracks Index") {
      href = "http://45.76.2.28/trackIndex";
    }

    return (
      <IconButton key={href}>
        <a
          className="w-64 p-4 rounded-2xl text-sm bg-btn text-white text-center w-full"
          href={href}
        >
          {str}
        </a>
      </IconButton>
    );
  });

  return (
    <body className="bg-primary-100 flex flex-col gap-4">
      <div className="font-bold text-center p-1 bg-primary-200 w-full">
        <div>ਕੀਰਤਿਕਰਹਿਸਗਲਜਨਤੇਰੀਤੂਅਬਿਨਾਸੀਪੁਰਖੁਮੁਰਾਰੇ॥</div>
        <div>
          All beings sing Your Praises; You are the imperishable Primal Being,
          the Destroyer of ego.
        </div>
      </div>
      <div className="w-svw flex flex-col gap-5 justify-center items-center">
        {atags}
      </div>
    </body>
  );
}
