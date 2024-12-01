import "./responseHeader.scss";
export default function ResponseHeader() {
  return (
    <div className="response-header">
      <nav class="navbar fixed-top navbar-light bg-blue">
        <div class="container-fluid">
          <div class="navbar-brand d-flex align-items-center w-100 ">
            <img
              src="/heroVired.svg"
              alt=""
              width="30"
              height="24"
              class="d-inline-block align-text-top"
            />
            <p className="title text-center w-100 m-0">NPS SURVEY</p>
          </div>
        </div>
      </nav>
    </div>
  );
}
