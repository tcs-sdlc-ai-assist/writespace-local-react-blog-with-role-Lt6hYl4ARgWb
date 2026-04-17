import PropTypes from 'prop-types';

export function StatCard({ icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-md">
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${color}`}
      >
        <span className="text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};