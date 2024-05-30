<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

include '../DBconnect.php';

$objDb = new DbConnect;

$pdo = $objDb->connect(); 

if ($pdo) {
    $tableName = 'tickets';
    $incident_number = 'INCIDENT_NUMBER';
    $service = 'SERVICE';
    $priority = 'PRIORITY';
    $submit_date = 'SUBMIT_DATE';
    $resolve_date = 'RESOLVE_DATE';
    $required_resolution_datetime = 'REQUIRED_RESOLUTION_DATETIME';
    $end_of_impact = 'END_OF_IMPACT';
    $panding_duration = 'PANDING_DURATION';
    $resolution_category = 'RESOLUTION_CATEGORY';
    $status = 'STATUS';
    $submitter = 'SUBMITTER';
    $assigned_group = 'ASSIGNED_GROUP';
    $assignee = 'ASSIGNEE';
    $description = 'DESCRIPTION';
    $notes = 'NOTES';
    $resolution = 'RESOLUTION';
    $project = 'PROJECT';
    $resolve_time = 'RESOLVE_TIME';
    $panding_minutes = 'PANDING_MINUTE';
    $close_date = 'CLOSE_DATE';
    $resolve_sla = 'RESOLVE_SLA';
    $respond_sla = 'RESPOND_SLA';
    $sla_status = 'SLA_STATUS';
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        // Initialize filter variables
        $filters = [
            'valueBegin' => null,
            'valueEnd' => null,
            'timeSpan' => null,
            'priority' => null,
            'service' => null,
            'project' => null,
            'assigner' => null,
        ];

        // Populate filter variables with the received data
        foreach ($filters as $key => $value) {
            if (isset($data[$key])) {
                $filters[$key] = $data[$key];
            }
        }

        // Initialize the base SQL query
        $baseSql = "SELECT DISTINCT INCIDENT_NUMBER, SERVICE, PRIORITY, ASSIGNED_GROUP, RESOLVE_TIME, PROJECT, RESOLUTION_CATEGORY FROM $tableName WHERE SLA_STATUS = :slaStatus";

        // Function to add filters to the query
        function addFiltersToQuery($filters, &$params) {
            $sql = "";
            if ($filters['valueBegin']) {
                $sql .= " AND SUBMIT_DATE >= :valueBegin";
                $params[':valueBegin'] = $filters['valueBegin'];
            }
            if ($filters['valueEnd']) {
                $sql .= " AND SUBMIT_DATE <= :valueEnd";
                $params[':valueEnd'] = $filters['valueEnd'];
            }
            if ($filters['timeSpan']) {
                $sql .= " AND TIME_SPAN = :timeSpan";
                $params[':timeSpan'] = $filters['timeSpan'];
            }
            if ($filters['priority']) {
                $sql .= " AND PRIORITY = :priority";
                $params[':priority'] = $filters['priority'];
            }
            if ($filters['service']) {
                $sql .= " AND SERVICE = :service";
                $params[':service'] = $filters['service'];
            }
            if ($filters['project']) {
                $sql .= " AND PROJECT = :project";
                $params[':project'] = $filters['project'];
            }
            if ($filters['assigner']) {
                $sql .= " AND ASSIGNEE = :assigner";
                $params[':assigner'] = $filters['assigner'];
            }
            return $sql;
        }

        // Prepare parameters for the SQL query
        $params = [':slaStatus' => 'inSLA'];
        $sqlInSLA = $baseSql . addFiltersToQuery($filters, $params);
        $stmtInSLA = $pdo->prepare($sqlInSLA);
        $stmtInSLA->execute($params);
        $ticketsInSLA = $stmtInSLA->fetchAll(PDO::FETCH_ASSOC);

        // Reset parameters for the next query
        $params = [':slaStatus' => 'outSLA'];
        $sqlOutSLA = $baseSql . addFiltersToQuery($filters, $params);
        $stmtOutSLA = $pdo->prepare($sqlOutSLA);
        $stmtOutSLA->execute($params);
        $ticketsOutSLA = $stmtOutSLA->fetchAll(PDO::FETCH_ASSOC);

        if ($ticketsOutSLA !== false && $ticketsInSLA !== false) {
            $responseData = [
                'headers' => ['INCIDENT_NUMBER', 'SERVICE', 'PRIORITY', 'ASSIGNED_GROUP', 'RESOLVE_TIME', 'PROJECT', 'RESOLUTION_CATEGORY'],
                'ticketsOutSLA' => $ticketsOutSLA,
                'ticketsInSLA' => $ticketsInSLA
            ];  

            echo json_encode($responseData);
        } else {
            echo "Error executing query: " . $pdo->errorInfo()[2];
        }

        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $sqlInSLA = "SELECT DISTINCT $incident_number, $service, $priority, $assigned_group, $resolve_time, $project, $resolution_category FROM $tableName WHERE SLA_STATUS = 'inSLA'";
        $stmtInSLA = $pdo->query($sqlInSLA);
        $ticketsInSLA = $stmtInSLA->fetchAll(PDO::FETCH_ASSOC);

        $sqlOutSLA = "SELECT DISTINCT $incident_number, $service, $priority, $assigned_group, $resolve_time, $project, $resolution_category  FROM $tableName WHERE SLA_STATUS = 'outSLA'";
        $stmtOutSLA = $pdo->query($sqlOutSLA);
        $ticketsOutSLA = $stmtOutSLA->fetchAll(PDO::FETCH_ASSOC);

        // Fetch filter options
        $sqlPriorityFilter = "SELECT DISTINCT $priority FROM tickets";
        $stmtPriorityFilter = $pdo->query($sqlPriorityFilter);
        $priorityFilter = $stmtPriorityFilter->fetchAll(PDO::FETCH_ASSOC);

        $sqlServiceFilter = "SELECT DISTINCT $service FROM tickets";
        $stmtServiceFilter = $pdo->query($sqlServiceFilter);
        $serviceFilter = $stmtServiceFilter->fetchAll(PDO::FETCH_ASSOC);

        $sqlProjectsFilter = "SELECT DISTINCT $project FROM tickets";
        $stmtProjectsFilter = $pdo->query($sqlProjectsFilter);
        $projectsFilter = $stmtProjectsFilter->fetchAll(PDO::FETCH_ASSOC);

        $sqlAssigneeFilter = "SELECT DISTINCT $assignee FROM tickets";
        $stmtAssigneeFilter = $pdo->query($sqlAssigneeFilter);
        $assigneeFilter = $stmtAssigneeFilter->fetchAll(PDO::FETCH_ASSOC);

        if ($ticketsOutSLA !== false && $ticketsInSLA !== false) {
            $responseData = [
                'filters' => [
                    'timeSpanFilter' => ['Daily', 'Weekly', 'Monthly'],
                    'priorityFilter' => array_column($priorityFilter, $priority),
                    'serviceFilter' => array_column($serviceFilter, $service),
                    'projectsFilter' => array_column($projectsFilter, $project),
                    'assigneeFilter' => array_column($assigneeFilter, $assignee)
                ],
                'graphics' => [
                    'sla' => [
                        'headers' => [ $incident_number, $service, $priority, $assigned_group, $resolve_time, $project, $resolution_category],
                        'ticketsOutSLA' => $ticketsOutSLA,
                        'ticketsInSLA' => $ticketsInSLA
                    ]
                ]
            ];  

            echo json_encode($responseData);
        } else {
            echo "Error executing query: " . $pdo->errorInfo()[2];
        }
    } else {
        echo "Invalid request method.";
    }
} else {
    echo "Failed to connect to the database.";
}
?>
