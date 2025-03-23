/**
 * Component definition for the dashboard home component.
 * @param props The props for the dashboard home component.
 * @returns The dashboard home component.
 */
function DashboardHome() {
  return (
    <div className="p-2">
      <div className="card shadow-lg compact side bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Card Title</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            necessitatibus incidunt ut officiis explicabo inventore.
          </p>
          <div className="justify-end card-actions"></div>
        </div>
      </div>
    </div>
  );
}

// Export the dashboard home component.
export default DashboardHome;
