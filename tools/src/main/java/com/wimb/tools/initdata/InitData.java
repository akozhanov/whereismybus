package com.wimb.tools.initdata;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.text.MessageFormat;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Stream;

public class InitData {
    private static final Logger logger = Logger.getLogger(InitData.class.getName());
    private static Connection conn = null;
    private static int routeId = -1;
    private static int routeDirectionId = -1;


    public static void main(String[] args) throws SQLException {
        logger.setLevel(Level.INFO);
        try {
            conn = DriverManager.getConnection("jdbc:mysql://wimb-db:3306/wimb?user=root&password=dat1a57&useUnicode=true&characterEncoding=utf-8");
            logger.info("DB has been connected");
            PreparedStatement stmt = conn.prepareStatement("select count(id) as routes_count from route");
            ResultSet rst = stmt.executeQuery();
            rst.first();
            int routesCount = rst.getInt("routes_count");
            if (routesCount > 0){
                logger.info("DB is already initialized");
                return;
            }
            try (Stream<String> stream = Files.lines(Paths.get("/usr/src/target/route-226-back-def.txt"), Charset.forName("utf-8"))) {
                stream.forEach(InitData::storeLine);
            } catch (IOException e) {
                e.printStackTrace();
            }

        } catch (SQLException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        } finally {
            conn.close();
            logger.info("DB has been disconnected");
        }
    }

    private static void storeLine(String line){
        String[] data = line.split(";");
        if (data[0].equals("route")) storeRoute(data);
        if (data[0].equals("route-direction")) storeRouteDirection(data);
        if (data[0].equals("bus-stop")) storeBusStop(data);
        if (data[0].equals("route-marker")) storeRouteMarker(data);
    }

    private static void storeRouteMarker(String[] data) {
        String sql = new MessageFormat("insert into route_point (name, lat, lon, route_direction_id, route_point_type_id) values (''{0}'',{1},{2},{3},{4})").format(
                new Object[]{data[3], data[1], data[2], routeDirectionId, 2}
        );
        insertRecord(sql);
    }

    private static void storeBusStop(String[] data) {
        String sql = new MessageFormat("insert into route_point (name, lat, lon, route_direction_id, route_point_type_id) values (''{0}'',{1},{2},{3},{4})").format(
                new Object[]{data[3], data[1], data[2], routeDirectionId, 1}
        );
        insertRecord(sql);
    }

    private static void storeRouteDirection(String[] data) {
        String sql = new MessageFormat("insert into route_direction (name, route_id) values (''{0}'', {1})").format(new Object[]{data[1], routeId});
        routeDirectionId = insertRecord(sql);
    }

    private static void storeRoute(String[] data) {
        String sql = new MessageFormat("insert into route (number, name) values (''{0}'',''{1}'')").format(new Object[]{data[1], data[2]});
        routeId = insertRecord(sql);
    }

    private static int insertRecord(String sql){
        int result = -1;
        logger.info(sql);
        try {
            Statement stmt = conn.createStatement();
            stmt.executeUpdate(sql, Statement.RETURN_GENERATED_KEYS);
            ResultSet rs = stmt.getGeneratedKeys();
            rs.next();
            result = rs.getInt(1);
        } catch (SQLException e) {
            logger.log(Level.SEVERE, e.getMessage(), e);
        }
        return result;
    }
}
